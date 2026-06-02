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
console.log(`Found ${htmlFiles.length} HTML files.`);

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // We want to find the stats section
    const index = content.indexOf('<!-- Stats Section -->');
    if (index !== -1) {
        // Let's print the 500 characters after "<!-- Stats Section -->"
        // And check if there is a truncation / missing closing tags
        console.log(`\n=========================================`);
        console.log(`File: ${relativePath}`);
        
        // Find 24/7 customer support
        const customerSupportIndex = content.indexOf('customer support', index);
        if (customerSupportIndex !== -1) {
            const contextStart = customerSupportIndex - 100;
            const contextEnd = customerSupportIndex + 400;
            const context = content.substring(contextStart, Math.min(contextEnd, content.length));
            console.log(`--- Stats End Context ---`);
            console.log(context);
        } else {
            console.log(`--- Stats found but no 'customer support' text! ---`);
        }
    }
});
