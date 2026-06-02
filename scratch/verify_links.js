const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

// Synonym/Keyword map to check if target pages match the link meaning
const KEYWORD_MAP = {
    "registration & marketing": ["registration", "marketing", "operations"],
    "venue sourcing": ["venue", "sourcing", "conferences", "diagramming"],
    "event diagramming": ["diagram", "conferences", "venue"],
    "repeatable events": ["events+", "repeatable", "video"],
    "hotel room blocks": ["travel", "hotel", "room", "blocks"],
    "approvals & budgeting": ["budget", "marketing", "operations"],
    "speaker management": ["speaker", "conferences"],
    "event app": ["app", "person", "events"],
    "check-in & badging": ["check-in", "badging", "person"],
    "attendee engagement": ["engagement", "networking"],
    "trade show lead capture": ["trade", "shows", "lead"],
    "trade show meetings": ["trade", "shows", "meetings"],
    "virtual experience": ["virtual", "experience", "events"],
    "webinars": ["webinar", "webinars"],
    "event & attendee insights": ["insights", "marketing", "operations"],
    "integrations": ["integrations", "marketing", "operations"],
    "surveys": ["surveys", "marketing", "operations"],
    "lead retrieval": ["lead", "retrieval", "trade", "shows"],
    "ai content repurposing": ["events+", "repurposing", "video"],
    
    // Event types
    "agency": ["agencies", "partners"],
    "association": ["association", "associations"],
    "financial services": ["financial", "services"],
    "higher education": ["higher", "education"],
    "life sciences": ["life", "sciences"],
    "technology": ["technology"],
    "in-person": ["in-person"],
    "hybrid": ["hybrid"],
    "virtual": ["virtual"],
    "webinar": ["webinar", "webinars"],
    "conference": ["complex", "events", "conferences"],
    "field marketing": ["field", "marketing"],
    "internal event": ["internal"],
    "networking": ["networking"],
    "sales kickoff": ["sales", "kickoff", "kickoffs"],
    "trade show": ["trade", "show", "shows"],
    
    // Resources
    "all resources": ["resources", "all"],
    "blog": ["blog"],
    "case studies": ["case", "studies"],
    "podcast": ["podcast"],
    "upcoming events": ["upcoming", "events"],
    "upcoming webinars": ["upcoming", "events", "webinars"],
    "community": ["community"],
    "certification": ["certification", "certifications"],
    "training": ["academy", "training"],
    "knowledge base": ["knowledge", "base"],
    "professional services": ["professional", "services"],
    "security": ["security"],
    "support": ["support"]
};

// Clean link text for matching
function getKeywordsForLink(linkText) {
    const cleaned = linkText.toLowerCase().trim().replace(/&amp;/g, '&');
    
    // Check direct maps
    if (KEYWORD_MAP[cleaned]) return KEYWORD_MAP[cleaned];
    
    // Try matching subparts
    for (const key of Object.keys(KEYWORD_MAP)) {
        if (cleaned.includes(key) || key.includes(cleaned)) {
            return KEYWORD_MAP[key];
        }
    }
    
    // Fallback: split by words
    return cleaned.split(/\s+/).filter(w => w.length > 3);
}

function verifyLinkRelation(linkText, pageTitle, heroText) {
    const keywords = getKeywordsForLink(linkText);
    if (!keywords || keywords.length === 0) return true; // generic match fallback
    
    const combinedTargetText = `${pageTitle} ${heroText}`.toLowerCase();
    
    return keywords.some(keyword => combinedTargetText.includes(keyword.toLowerCase()));
}

// Function to extract text between HTML tags
function extractTagContent(html, startTag, endTag) {
    const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`, 'i');
    const match = html.match(regex);
    return match ? match[1].replace(/<[^>]*>/g, '').trim() : '';
}

function parseNavbarLinks(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    const results = [];
    
    // Find the desktop navigation block
    const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
    if (!navMatch) return results;
    
    const navHtml = navMatch[1];
    
    // Regex matches the dropdown structure or anchor lists
    // Let's divide by sections using dropdown headings
    const dropdowns = navHtml.split(/<!--\s*([^-]+?)\s*Dropdown\s*-->/gi);
    
    let currentSection = 'General';
    for (let i = 1; i < dropdowns.length; i += 2) {
        currentSection = dropdowns[i].trim();
        const dropdownHtml = dropdowns[i + 1];
        
        // Extract all anchors in this dropdown
        const anchorRegex = /<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        let match;
        while ((match = anchorRegex.exec(dropdownHtml)) !== null) {
            const href = match[1];
            const text = match[2].replace(/<[^>]*>/g, '').trim();
            
            // Skip non-internal links or hash-links
            if (href.startsWith('#') || href.startsWith('http') || text.toLowerCase().includes('learn more') || text.toLowerCase().includes('see all') || text.toLowerCase().includes('take a tour')) {
                continue;
            }
            
            results.push({
                section: currentSection,
                linkText: text,
                href: href
            });
        }
    }
    
    return results;
}

function verifyLinks(testPagePath) {
    console.log(`\n🔍 Parsing navbar links from test source page: ${path.basename(testPagePath)}`);
    const links = parseNavbarLinks(testPagePath);
    
    if (links.length === 0) {
        console.log(`❌ No desktop navbar dropdown links found in ${path.basename(testPagePath)}`);
        return;
    }
    
    console.log(`✅ Extracted ${links.length} distinct subpage links from the navbar sections:`);
    console.log(`========================================================================================`);
    console.log(`${'SECTION'.padEnd(15)} | ${'LINK TEXT'.padEnd(30)} | ${'TARGET FILE'.padEnd(35)} | ${'VERIFICATION STATUS'}`);
    console.log(`========================================================================================`);
    
    let passedCount = 0;
    let failedCount = 0;
    
    const dir = path.dirname(testPagePath);
    
    links.forEach(link => {
        // Resolve absolute target path
        const resolvedPath = path.resolve(dir, link.href);
        const resolvedBasename = path.basename(resolvedPath);
        
        if (!fs.existsSync(resolvedPath)) {
            console.log(`${link.section.padEnd(15)} | ${link.linkText.padEnd(30)} | ${resolvedBasename.padEnd(35)} | ❌ FAILED: File does not exist`);
            failedCount++;
            return;
        }
        
        // Read target file contents
        const targetHtml = fs.readFileSync(resolvedPath, 'utf8');
        const pageTitle = extractTagContent(targetHtml, '<title>', '</title>');
        const heroText = extractTagContent(targetHtml, '<h1[^>]*>', '</h1>');
        
        const isRelated = verifyLinkRelation(link.linkText, pageTitle, heroText);
        
        if (isRelated) {
            console.log(`${link.section.padEnd(15)} | ${link.linkText.padEnd(30)} | ${resolvedBasename.padEnd(35)} | ✅ PASSED (${pageTitle.split('|')[0].trim()})`);
            passedCount++;
        } else {
            console.log(`${link.section.padEnd(15)} | ${link.linkText.padEnd(30)} | ${resolvedBasename.padEnd(35)} | ⚠️ WARNING: Page might be unrelated (Title: "${pageTitle}", Heading: "${heroText}")`);
            failedCount++;
        }
    });
    
    console.log(`========================================================================================`);
    console.log(`📊 Test Execution Summary: ${passedCount} passed, ${failedCount} warnings/failures out of ${links.length} total navbar links.`);
}

// Run the verification on conferences.html as a baseline, and also index.html or networking-events.html
const testBaseline = path.join(PROJECT_ROOT, 'products', 'conferences.html');
verifyLinks(testBaseline);

// Run on event-types page as well
const testBaseline2 = path.join(PROJECT_ROOT, 'event-types', 'networking-events.html');
verifyLinks(testBaseline2);
