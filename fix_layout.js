const fs = require('fs');
const glob = require('path');
function walk(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('assets')) {
                results = results.concat(walk(file));
            }
        } else { 
            if (file.endsWith('.html')) results.push(file);
        }
    });
    return results;
}

let files = walk('E:/Cvent');
let count = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Check if the header does not have flex justify-between
    // The standard one looks like: <div class="flex justify-between items-center h-[72px]">
    // The broken ones like podcast.html look like:
    // <header class="bg-white border-b border-gray-100 h-16 sticky top-0 z-50 flex items-center justify-between px-6 shadow-sm">
    //     <div class="flex items-center space-x-6 lg:space-x-10">
    
    // We want to make sure the right side actions and mobile menu are placed correctly so they push to the right.
    // In podcast.html, the structure is:
    // <header ... flex items-center justify-between ...>
    //     <div class="flex items-center space-x-6 lg:space-x-10">
    //         [Logo]
    //         <nav>...</nav>
    //     </div>  <-- WE NEED TO MAKE SURE THIS DIV CLOSES HERE so the actions are the second child of the header
    //     [Actions]
    //     [Mobile menu]
    // </header>

    // Wait, in podcast.html the actions were actually placed AFTER the closing </div> of the first block, let's check:
    
    const podcastRegex = /(<header[^>]*?flex[^>]*?justify-between[^>]*>)\s*(<div[^>]*?flex items-center space-x-6[^>]*>[\s\S]*?<\/nav>)/is;
    if (podcastRegex.test(content)) {
        // We need to ensure there is a closing </div> right after the </nav> if it's missing,
        // OR if the actions are inside the first div, we need to move them out.
        // Actually, the issue in podcast.html is that when I added the actions, I injected them after </nav>.
        // So the structure became:
        // <div class="flex items-center space-x-6 ...">
        //    [Logo]
        //    <nav>...</nav>
        //    <!-- Actions -->
        // </div>
        // Which means the actions are INSIDE the left flex container, so they just sit right next to the nav!
        
        let newContent = content.replace(/(<\/nav>)\s*(<!-- Actions -->[\s\S]*?<!-- Mobile menu button -->[\s\S]*?<\/div>)/i, '$1\n        </div>\n$2');
        if (newContent !== content) {
            fs.writeFileSync(f, newContent, 'utf8');
            count++;
            console.log('Fixed header layout in ' + f);
        }
    }
});
console.log('Fixed layout in ' + count + ' files.');