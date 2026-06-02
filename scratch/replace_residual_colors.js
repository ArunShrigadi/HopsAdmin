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
console.log(`Scanning ${htmlFiles.length} HTML files for residual colors...`);

let replacedCount = 0;

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace Cvent Community Green #00a37a with HOPS Brand Accent Orange #f26522
    content = content.replace(/#00a37a/gi, '#f26522');
    
    // Replace Cvent Highlight Green #00bf8f with HOPS Brand Accent Orange #f26522
    content = content.replace(/#00bf8f/gi, '#f26522');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        replacedCount++;
        console.log(`[REPLACED residual colors] ${relativePath}`);
    }
});

console.log(`\nDone! Residual colors replaced in ${replacedCount} files.`);
