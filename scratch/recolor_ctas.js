const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        const fullPath = path.join(dir, file);
        let stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('assets') && !file.includes('scratch') && !file.includes('admin')) {
                results = results.concat(walk(fullPath));
            }
        } else { 
            if (file.endsWith('.html') && !file.endsWith('.bak')) results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = walk(PROJECT_ROOT);
console.log(`Scanning ${htmlFiles.length} HTML files for button, gradient, form and hero recoloring...`);

function replaceGradients(content) {
    const gradientRegex = /linear-gradient\(\s*([^)]+)\)/gi;
    
    const legacyBlues = ['#185bd1', '#1f50e6', '#0b61e4', '#0a64e8', '#125ed1', '#2462e8', '#1a6fdb', '#1a56db', '#0a2a8a', '#3b82f6'];
    const legacyPurples = ['#8b5cf6', '#7648e8', '#6839e2', '#7e46f6', '#8857f6', '#7c3aed', '#6366f1'];
    
    return content.replace(gradientRegex, (match, innerContent) => {
        const containsBlue = legacyBlues.some(blue => innerContent.toLowerCase().includes(blue));
        const containsPurple = legacyPurples.some(purple => innerContent.toLowerCase().includes(purple));
        
        if (containsBlue && containsPurple) {
            if (innerContent.includes('90deg')) {
                return 'linear-gradient(90deg, #003666 0%, #f26522 100%)';
            } else if (innerContent.includes('120deg')) {
                return 'linear-gradient(120deg, #004b87 0%, #f26522 100%)';
            } else if (innerContent.includes('160deg')) {
                return 'linear-gradient(160deg, #004b87 0%, #f26522 100%)';
            } else if (innerContent.includes('180deg')) {
                if (innerContent.includes('rgba')) {
                    return 'linear-gradient(180deg, rgba(0,75,135,0.5) 0%, rgba(242,101,34,0.85) 100%)';
                }
                return 'linear-gradient(180deg, #004b87 0%, #f26522 100%)';
            }
            return 'linear-gradient(135deg, #004b87 0%, #f26522 100%)';
        }
        
        // Also handle the cyan/blue gradient in index.html: linear-gradient(135deg, #1a6fdb 0%, #1890c4 50%, #16aba4 100%)
        if (innerContent.toLowerCase().includes('#1a6fdb') && innerContent.toLowerCase().includes('#16aba4')) {
            return 'linear-gradient(135deg, #004b87 0%, #f26522 100%)';
        }
        
        return match;
    });
}

let replacedCount = 0;

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. RECOLOR CTAS & HEROES: Replace `#004b87` (blue) or `#00b2a9` (teal) CTA classes/styles with HOPS Orange `#f26522`
    
    // Replace outline buttons with #004b87 or #00b2a9
    content = content.replace(/border-\[#004b87\]/g, 'border-[#f26522]');
    content = content.replace(/text-\[#004b87\]/g, 'text-[#f26522]');
    content = content.replace(/hover:bg-\[#004b87\]/g, 'hover:bg-[#f26522]');
    
    content = content.replace(/border-\[#00b2a9\]/g, 'border-[#f26522]');
    content = content.replace(/text-\[#00b2a9\]/g, 'text-[#f26522]');
    content = content.replace(/hover:bg-\[#00b2a9\]/g, 'hover:bg-[#f26522]');
    content = content.replace(/bg-\[#00b2a9\]/g, 'bg-[#f26522]');
    
    // Replace hover states for outline buttons
    content = content.replace(/hover:border-\[#004b87\]/g, 'hover:border-[#f26522]');
    content = content.replace(/hover:text-\[#004b87\]/g, 'hover:text-[#f26522]');
    content = content.replace(/hover:border-\[#00b2a9\]/g, 'hover:border-[#f26522]');
    content = content.replace(/hover:text-\[#00b2a9\]/g, 'hover:text-[#f26522]');
    content = content.replace(/group-hover:text-\[#004b87\]/g, 'group-hover:text-[#f26522]');
    content = content.replace(/group-hover:text-\[#00b2a9\]/g, 'group-hover:text-[#f26522]');

    // Replace focus states
    content = content.replace(/focus:ring-\[#004b87\]/g, 'focus:ring-[#f26522]');
    content = content.replace(/focus:ring-\[#00b2a9\]/g, 'focus:ring-[#f26522]');
    content = content.replace(/focus:border-\[#004b87\]/g, 'focus:border-[#f26522]');

    // Replace solid button classes
    content = content.replace(/bg-\[#004b87\]/g, 'bg-[#f26522]');
    content = content.replace(/hover:bg-\[#0052b3\]/g, 'hover:bg-[#d85218]');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#d85218]');
    content = content.replace(/hover:bg-\[#0055c0\]/g, 'hover:bg-[#d85218]');
    content = content.replace(/hover:bg-\[#0055ff\]/g, 'hover:bg-[#d85218]');
    content = content.replace(/hover:bg-blue-600/g, 'hover:bg-[#d85218]');
    content = content.replace(/hover:bg-\[#005ac0\]/g, 'hover:bg-[#d85218]');

    // Inline style attributes for buttons
    content = content.replace(/style="background:#004b87"/gi, 'style="background:#f26522"');
    content = content.replace(/style="background-color:#004b87"/gi, 'style="background-color:#f26522"');
    content = content.replace(/style="background:#00b2a9"/gi, 'style="background:#f26522"');
    content = content.replace(/style="background-color:#00b2a9"/gi, 'style="background-color:#f26522"');
    
    // index.html specific elements
    content = content.replace(/hover:text-\[#1a6fdb\]/g, 'hover:text-[#f26522]');
    content = content.replace(/color:\s*#2462e8/gi, 'color: #f26522');
    content = content.replace(/text-\[#1a6fdb\]/g, 'text-[#f26522]');
    content = content.replace(/border-\[#1a6fdb\]/g, 'border-[#f26522]');
    content = content.replace(/bg-\[#1a6fdb\]/g, 'bg-[#f26522]');
    content = content.replace(/hover:bg-\[#1a6fdb\]/g, 'hover:bg-[#f26522]');

    // 2. RECOLOR GRADIENTS: Replace blue-to-purple / purple gradients with deep-blue-to-orange gradient
    content = replaceGradients(content);

    // Tailored background class gradient: bg-gradient-to-r from-[#185bd1] to-[#7648e8]
    content = content.replace(/bg-gradient-to-r\s+from-\[#185bd1\]\s+to-\[#7648e8\]/gi, 'bg-gradient-to-r from-[#003666] to-[#f26522]');
    content = content.replace(/from-\[#185bd1\]\s+to-\[#7648e8\]/gi, 'from-[#003666] to-[#f26522]');
    content = content.replace(/bg-gradient-to-r\s+from-\[#2462e8\]\s+to-\[#7c3aed\]/gi, 'bg-gradient-to-r from-[#004b87] to-[#f26522]');
    content = content.replace(/from-\[#2462e8\]\s+to-\[#7c3aed\]/gi, 'from-[#004b87] to-[#f26522]');

    // Green circle accent in CSN card
    content = content.replace(/background:#16aba4/gi, 'background:#f26522');
    
    // Replaces tailwind outline buttons where border was gray but hovers were blue:
    content = content.replace(/hover:border-\[#004b87\]\s+hover:text-\[#004b87\]/gi, 'hover:border-[#f26522] hover:text-[#f26522]');
    content = content.replace(/hover:text-\[#004b87\]\s+hover:border-\[#004b87\]/gi, 'hover:text-[#f26522] hover:border-[#f26522]');
    
    // Add additional outline hovers for white outline buttons on colored backgrounds
    content = content.replace(/hover:text-\[#185bd1\]/gi, 'hover:text-[#004b87]');
    content = content.replace(/bg-\[#185bd1\]/g, 'bg-[#002f5c]');

    // 3. BRAND NEW REPLACEMENTS FOR RESIDUAL BLUE/INDIGO HEROES AND FORM FIELDS
    
    // Trade-shows solid indigo hero section background
    content = content.replace(/bg-\[#4b55f6\]/g, 'bg-[#004b87]');
    
    // Active form input controls and focus rings: #245fe6 (legacy blue) to #f26522 (orange)
    content = content.replace(/#245fe6/gi, '#f26522');
    
    // Video play buttons: bg-[#5b9cf0] to bg-[#f26522] (orange)
    content = content.replace(/bg-\[#5b9cf0\]/g, 'bg-[#f26522]');
    content = content.replace(/hover:bg-blue-400/g, 'hover:bg-[#d85218]');
    content = content.replace(/hover:bg-teal-600/g, 'hover:bg-[#d85218]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        replacedCount++;
        console.log(`[RECOLORED CTAS & GRADIENTS & HEROES] ${relativePath}`);
    }
});

console.log(`\nSuccessfully processed and recolored CTAs, Gradients, and Heroes in ${replacedCount} files.`);
