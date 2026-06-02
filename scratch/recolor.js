const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

const REPLACEMENTS = [
  // 1. Tailwind Config colors
  { search: /'#10143a'/gi, replace: "'#080b25'" },
  { search: /'#161851'/gi, replace: "'#080b25'" },
  { search: /'#006ae1'/gi, replace: "'#004b87'" },
  { search: /'#845ef7'/gi, replace: "'#f26522'" },

  // 2. Gradients (linear and radial)
  { search: /linear-gradient\(135deg,\s*#1f50e6\s+0%,\s*#8857f6\s+100%\)/gi, replace: 'linear-gradient(135deg, #004b87 0%, #f26522 100%)' },
  { search: /linear-gradient\(135deg,\s*#0b61e4\s+0%,\s*#6839e2\s+100%\)/gi, replace: 'linear-gradient(135deg, #004b87 0%, #f26522 100%)' },
  { search: /linear-gradient\(135deg,\s*#0a64e8\s+0%,\s*#7e46f6\s+100%\)/gi, replace: 'linear-gradient(135deg, #004b87 0%, #f26522 100%)' },
  { search: /linear-gradient\(90deg,\s*#185bd1\s+0%,\s*#7648e8\s+100%\)/gi, replace: 'linear-gradient(90deg, #003666 0%, #f26522 100%)' },
  
  { search: /radial-gradient\(circle\s+at\s+80%\s+20%,\s*rgba\(132,\s*94,\s*247,\s*0\.15\)\s+0%,\s*transparent\s+40%\)/gi, replace: 'radial-gradient(circle at 80% 20%, rgba(242, 101, 34, 0.15) 0%, transparent 40%)' },
  { search: /radial-gradient\(circle\s+at\s+20%\s+80%,\s*rgba\(0,\s*85,\s*255,\s*0\.15\)\s+0%,\s*transparent\s+40%\)/gi, replace: 'radial-gradient(circle at 20% 80%, rgba(0, 75, 135, 0.15) 0%, transparent 40%)' },

  // 3. Hex code replacements in custom style sheets & attributes
  { search: /#006ae1/gi, replace: '#004b87' },
  { search: /#845ef7/gi, replace: '#f26522' },
  { search: /#161851/gi, replace: '#080b25' },
  { search: /#10143a/gi, replace: '#080b25' },
  { search: /#0b2265/gi, replace: '#002f5c' },
  { search: /#2563eb/gi, replace: '#f26522' },

  // 4. Utility / Hover classes in Tailwind
  { search: /bg-\[#0b2265\]/gi, replace: 'bg-[#002f5c]' },
  { search: /bg-\[#f1f7ff\]/gi, replace: 'bg-[#fff8f5]' },
  { search: /group-hover:bg-\[#f1f7ff\]/gi, replace: 'group-hover:bg-[#fff8f5]' },
  { search: /group-hover:text-\[#006ae1\]/gi, replace: 'group-hover:text-[#f26522]' },
  { search: /text-\[#1688f2\]/gi, replace: 'text-[#f26522]' },
  { search: /text-\[#7c57d9\]/gi, replace: 'text-[#f26522]' },
  { search: /bg-gradient-to-r\s+from-\[#8157e6\]\s+via-\[#1877f2\]\s+to-\[#00bf8f\]/gi, replace: 'bg-gradient-to-r from-[#e65c00] via-[#004b87] to-[#f26522]' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  let count = 0;

  for (const item of REPLACEMENTS) {
    const matches = content.match(item.search);
    if (matches) {
      count += matches.length;
      content = content.replace(item.search, item.replace);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${path.relative(PROJECT_ROOT, filePath)} — ${count} replacement(s) applied.`);
    return true;
  }
  return false;
}

function scanDir(dir) {
  const ignore = new Set(['admin', 'node_modules', '.git', 'scratch', 'assets']);
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (ignore.has(file.name)) continue;
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      scanDir(fullPath);
    } else if (file.name.endsWith('.html') && !file.name.includes('.bak')) {
      processFile(fullPath);
    }
  }
}

console.log('🚀 Running brand recoloring for HOPS Events...');
scanDir(PROJECT_ROOT);
console.log('✅ Recoloring complete!');
