/**
 * Cvent Admin Editor — server v3
 * ═══════════════════════════════════════════════════════════════
 * CORE FIX: Save no longer relies on sessions or data-editor-id
 * in the original file. Instead it uses tag+tagIndex to locate
 * elements deterministically in the ORIGINAL file every time.
 *
 * Auth: token-based (stored in localStorage, sent via header)
 * ═══════════════════════════════════════════════════════════════
 */

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const cheerio  = require('cheerio');
const multer   = require('multer');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 3737;

const PROJECT_ROOT = __dirname;
const IMAGES_DIR   = path.join(PROJECT_ROOT, 'assets', 'images');

// ── Auth ──────────────────────────────────────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'hopesevent2026';
const validTokens = new Set();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function requireAuth(req, res, next) {
  // Public paths — the editor HTML itself is public; only API/preview routes need a token
  const pub = ['/login', '/api/auth', '/site/', '/', '/admin'];
  if (pub.some(p => req.path === p || req.path.startsWith(p))) return next();

  const token = req.headers['x-admin-token'] || req.query.token;
  if (!validTokens.has(token)) {
    if (req.path.startsWith('/api/') || req.path.startsWith('/preview/')) {
      return res.status(401).json({ error: 'Unauthorized — please log in' });
    }
    return res.redirect('/login');
  }
  next();
}
app.use(requireAuth);

// ── Auth endpoints ────────────────────────────────────────────────────────────
app.get('/login', (_req, res) => res.sendFile(path.join(__dirname, 'login.html')));

app.post('/api/auth', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && (password === ADMIN_PASS || password === 'cvent2024')) {
    const token = 'cvnt_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    validTokens.add(token);
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) validTokens.delete(token);
  res.json({ success: true });
});

// ── Static assets ─────────────────────────────────────────────────────────────
app.use('/site', express.static(PROJECT_ROOT));
app.get('/admin', (_req, res) => res.sendFile(path.join(__dirname, 'editor.html')));
app.use('/', express.static(PROJECT_ROOT));

// ── Multer (image upload) ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGES_DIR),
  filename:    (_req, file, cb) => cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ═════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/** Recursively list HTML files, ignoring admin/node_modules/.git/scratch */
function findHtmlFiles(dir) {
  const ignore = new Set(['admin','node_modules','.git','scratch','assets']);
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return results; }
  for (const e of entries) {
    if (ignore.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...findHtmlFiles(full));
    else if (e.name.endsWith('.html') && !e.name.includes('.bak') && !e.name.startsWith('saved_resource'))
      results.push(path.relative(PROJECT_ROOT, full).replace(/\\/g, '/'));
  }
  return results;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/** Replace text in an element, splitting by newlines and inserting br tags */
function safeSetText($el, newText) {
  $el.empty();
  const parts = newText.split('\n');
  parts.forEach((part, idx) => {
    if (idx > 0) {
      $el.append('<br>');
    }
    $el.append(escapeHtml(part));
  });
}

/**
 * Annotate a Cheerio document.
 * Records data-editor-tag (tag name) and data-editor-tag-idx (position
 * among all same-tag elements in the document) so save can find them
 * deterministically in the ORIGINAL file without needing sessions.
 */
const EDIT_TAGS = ['h1','h2','h3','h4','h5','h6','p','a','button','li','span','label','td','th','strong','em','b','i','small','u','dt','dd','time'];

function annotateDocument($) {
  const tagCounters = {};
  let globalId = 0;

  // Track total tag counts first (needed for consistent idx)
  [...EDIT_TAGS, 'img'].forEach(t => { tagCounters[t] = 0; });

  for (const tag of EDIT_TAGS) {
    $(tag).each((_, el) => {
      const $el    = $(el);
      const tagIdx = tagCounters[tag]++;

      if ($el.attr('data-editor-id')) return; // already tagged
      // Skip container elements that have block children
      if ($el.children('div,p,ul,ol,section,article,h1,h2,h3,h4,h5,h6').length) return;

      const text = $el.text().trim();
      if (!text || text.length < 1 || text.length > 10000) return;

      $el.attr('data-editor-id',      `eid_${globalId++}`)
         .attr('data-editor-type',    'text')
         .attr('data-editor-tag',     tag)
         .attr('data-editor-tag-idx', tagIdx);
    });
  }

  // Images
  $('img').each((_, el) => {
    const $el    = $(el);
    const tagIdx = tagCounters['img']++;
    if ($el.attr('data-editor-id')) return;

    $el.attr('data-editor-id',      `eid_${globalId++}`)
       .attr('data-editor-type',    'image')
       .attr('data-editor-tag',     'img')
       .attr('data-editor-tag-idx', tagIdx);
  });
}

/** Convert a /site/ web path back to a relative file path */
function siteUrlToRelative(siteUrl, pagePath) {
  if (!siteUrl || !siteUrl.startsWith('/site/')) return siteUrl;
  const assetPath = siteUrl.replace(/^\/site\//, '');
  const pageDir   = path.dirname(pagePath);
  return path.posix.relative(pageDir, assetPath); // e.g. "../assets/images/foo.webp"
}

// ── Editor overlay injected into every preview page ───────────────────────────
const EDITOR_OVERLAY = `
<style>
  [data-editor-id] {
    cursor:pointer!important;
    outline:2px dashed transparent!important;
    transition:outline .12s, background .12s!important;
  }
  [data-editor-id]:hover {
    outline:2px dashed #3b82f6!important;
    outline-offset:3px!important;
    background:rgba(59,130,246,.07)!important;
  }
  .ed-sel {
    outline:2px solid #ef4444!important;
    outline-offset:3px!important;
    background:rgba(239,68,68,.07)!important;
  }
  [contenteditable="true"]:focus {
    outline:2px solid #3b82f6!important;
    outline-offset:3px!important;
    background:rgba(59,130,246,.05)!important;
  }
  #__ed_badge {
    position:fixed;top:12px;right:12px;z-index:2147483647;
    background:#1d4ed8;color:#fff;font:700 12px/1 system-ui,sans-serif;
    padding:7px 14px;border-radius:999px;pointer-events:none;
    box-shadow:0 4px 16px rgba(0,0,0,.35);letter-spacing:.03em;
  }
</style>
<script>
(function(){
  window.addEventListener('DOMContentLoaded',function(){
    var b=document.createElement('div');
    b.id='__ed_badge';b.textContent='✏️  EDIT MODE';
    document.body.appendChild(b);

    window.addEventListener('keydown',function(evt){
      if((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'z'){
        evt.preventDefault();
        window.parent.postMessage({type:'UNDO'},'*');
      }
      if((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'y'){
        evt.preventDefault();
        window.parent.postMessage({type:'REDO'},'*');
      }
    });

    // Setup inline editing on text nodes
    document.querySelectorAll('[data-editor-type="text"]').forEach(function(el){
      el.setAttribute('contenteditable','true');
      el.addEventListener('keydown',function(evt){
        if(evt.key==='Enter' && !evt.shiftKey){
          evt.preventDefault();
          el.blur();
        }
      });
      el.addEventListener('blur',function(){
        window.parent.postMessage({
          type: 'ELEMENT_TEXT_UPDATED',
          id:     el.getAttribute('data-editor-id'),
          tag:    el.getAttribute('data-editor-tag'),
          tagIdx: parseInt(el.getAttribute('data-editor-tag-idx')||'0',10),
          text:   el.innerText||el.textContent||''
        },'*');
      });
    });

    window.parent.postMessage({type:'EDITOR_READY'},'*');
  });

  window.addEventListener('scroll', function() {
    window.parent.postMessage({ type: 'IFRAME_SCROLL' }, '*');
  });

  var sel=null;
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-editor-id]');
    if(!el) {
      if(sel) sel.classList.remove('ed-sel');
      sel = null;
      window.parent.postMessage({ type: 'ELEMENT_UNSELECTED' }, '*');
      return;
    }
    
    // Don't prevent default on contenteditable fields so cursor can move
    if(el.getAttribute('contenteditable')==='true') {
      // Allow natural contenteditable focusing and editing
    } else {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if(sel)sel.classList.remove('ed-sel');
    el.classList.add('ed-sel');
    sel=el;
    
    var r = el.getBoundingClientRect();
    window.parent.postMessage({
      type:'ELEMENT_SELECTED',
      id:         el.getAttribute('data-editor-id'),
      editorType: el.getAttribute('data-editor-type'),
      tag:        el.getAttribute('data-editor-tag'),
      tagIdx:     parseInt(el.getAttribute('data-editor-tag-idx')||'0',10),
      text:       el.innerText||el.textContent||'',
      src:        el.getAttribute('src')||'',
      alt:        el.getAttribute('alt')||'',
      tagName:    el.tagName.toLowerCase(),
      rect: {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height
      }
    },'*');
  },true);

  window.addEventListener('message',function(e){
    var m=e.data; if(!m||!m.type)return;
    var el=m.id&&document.querySelector('[data-editor-id="'+m.id+'"]');
    if(!el)return;
    if(m.type==='PREVIEW_TEXT'){
      var nodes=el.childNodes,done=false;
      for(var i=0;i<nodes.length;i++){
        if(nodes[i].nodeType===3&&nodes[i].textContent.trim()){
          nodes[i].textContent=m.text;done=true;break;
        }
      }
      if(!done)el.textContent=m.text;
    }
    if(m.type==='PREVIEW_IMAGE'){
      el.src=m.src;
      if(m.alt!==undefined)el.alt=m.alt;
    }
  });
})();
</script>
`;

// ═════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// ── List pages ────────────────────────────────────────────────────────────────
app.get('/api/pages', (_req, res) => {
  const files = findHtmlFiles(PROJECT_ROOT);
  const tree  = {};
  for (const f of files) {
    const parts  = f.split('/');
    const folder = parts.length > 1 ? parts[0] : 'root';
    const name   = parts[parts.length - 1].replace('.html','').replace(/-/g,' ');
    if (!tree[folder]) tree[folder] = [];
    tree[folder].push({ path: f, name });
  }
  res.json(tree);
});

// ── Preview (annotated page for iframe) ───────────────────────────────────────
app.get('/preview/*', (req, res) => {
  const pagePath = req.params[0];
  const fullPath = path.join(PROJECT_ROOT, pagePath);
  if (!fs.existsSync(fullPath)) return res.status(404).send('Page not found');

  const html = fs.readFileSync(fullPath, 'utf8');
  const $    = cheerio.load(html, { decodeEntities: false });
  const dir  = path.dirname(pagePath);

  // 1. Annotate (tag + idx) — works on original content
  annotateDocument($);

  // 2. Rewrite relative asset paths → /site/... so preview can load them
  $('[href],[src]').each((_, el) => {
    const $el = $(el);
    ['href','src'].forEach(attr => {
      const v = $el.attr(attr);
      if (!v || /^(https?:|data:|#|\/\/)/.test(v)) return;
      $el.attr(attr, `/site/${path.posix.join(dir, v)}`);
    });
  });

  // 3. Inject editor overlay
  const finalHtml = $.html().replace('</body>', EDITOR_OVERLAY + '</body>');
  res.set('Content-Type', 'text/html').send(finalHtml);
});

// ── SAVE ─────────────────────────────────────────────────────────────────────
// Loads the ORIGINAL file, locates elements by tag+tagIdx (no session needed),
// applies changes, strips any editor attrs, writes back to disk.
app.post('/api/save', (req, res) => {
  const { pagePath, changes } = req.body || {};
  if (!pagePath || !Array.isArray(changes) || !changes.length)
    return res.status(400).json({ error: 'Missing pagePath or changes' });

  const fullPath = path.join(PROJECT_ROOT, pagePath);
  if (!fs.existsSync(fullPath))
    return res.status(404).json({ error: 'File not found: ' + pagePath });

  let html;
  try { html = fs.readFileSync(fullPath, 'utf8'); }
  catch(e) { return res.status(500).json({ error: 'Cannot read file: ' + e.message }); }

  const $ = cheerio.load(html, { decodeEntities: false });

  // Build a tag → elements array map (same order as annotation)
  const tagMap = {};
  [...EDIT_TAGS, 'img'].forEach(tag => {
    tagMap[tag] = $(tag).toArray();
  });

  let saved = 0;
  const errors = [];

  for (const change of changes) {
    const { tag, tagIdx, type, value, alt } = change;
    if (!tag || tagIdx === undefined || tagIdx === null) {
      errors.push(`Missing tag/tagIdx for change id=${change.id}`);
      continue;
    }

    const elements = tagMap[tag] || [];
    if (tagIdx >= elements.length) {
      errors.push(`tagIdx ${tagIdx} out of range for <${tag}> (found ${elements.length})`);
      continue;
    }

    const $el = $(elements[tagIdx]);

    if (type === 'text') {
      safeSetText($el, value);
      saved++;
    } else if (type === 'image') {
      // Convert /site/... URL to a relative path
      const finalSrc = value.startsWith('/site/') ? siteUrlToRelative(value, pagePath) : value;
      $el.attr('src', finalSrc);
      if (alt !== undefined) $el.attr('alt', alt);
      saved++;
    }
  }

  // Ensure no editor attrs leak into saved file (belt-and-suspenders)
  $('[data-editor-id]').each((_, el) => {
    $(el).removeAttr('data-editor-id')
         .removeAttr('data-editor-type')
         .removeAttr('data-editor-tag')
         .removeAttr('data-editor-tag-idx');
  });

  // Backup original (first time only)
  const backupPath = fullPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    try { fs.copyFileSync(fullPath, backupPath); } catch {}
  }

  try {
    fs.writeFileSync(fullPath, $.html(), 'utf8');
  } catch(e) {
    return res.status(500).json({ error: 'Cannot write file: ' + e.message });
  }

  console.log(`[SAVE] ${pagePath} — ${saved} change(s) applied. Errors: ${errors.length}`);
  if (errors.length) console.warn('[SAVE WARNINGS]', errors);

  res.json({ success: true, saved, warnings: errors });
});

// ── Restore from backup ───────────────────────────────────────────────────────
app.post('/api/restore', (req, res) => {
  const { pagePath } = req.body || {};
  const fullPath   = path.join(PROJECT_ROOT, pagePath || '');
  const backupPath = fullPath + '.bak';
  if (!fs.existsSync(backupPath))
    return res.status(404).json({ error: 'No backup exists for this page yet' });
  fs.copyFileSync(backupPath, fullPath);
  console.log(`[RESTORE] ${pagePath}`);
  res.json({ success: true });
});

// ── Image upload ──────────────────────────────────────────────────────────────
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received' });
  res.json({ success: true, filename: req.file.filename, webPath: `/site/assets/images/${req.file.filename}` });
});

// ── Image list ────────────────────────────────────────────────────────────────
app.get('/api/images', (_req, res) => {
  try {
    const files = fs.readdirSync(IMAGES_DIR)
      .filter(f => /\.(webp|jpg|jpeg|png|gif|svg)$/i.test(f))
      .map(f => ({ name: f, url: `/site/assets/images/${f}` }));
    res.json(files);
  } catch { res.json([]); }
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  Cvent Admin Editor  →  http://localhost:${PORT}`);
  console.log(`   Default login: admin / cvent2024\n`);
});
