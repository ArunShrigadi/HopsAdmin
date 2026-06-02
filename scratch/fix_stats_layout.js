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
console.log(`Scanning ${htmlFiles.length} HTML files...`);

let fixedCount = 0;

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if stats section is present
    if (content.includes('<!-- Stats Section -->')) {
        // Regex to match the Stats Section from "<!-- Stats Section -->" to "customer support</div>" plus any trailing divs/stray tags
        // up to the next section/main/comment/div/header block
        const statsRegex = /(<!-- Stats Section -->[\s\S]*?<section[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?customer support<\/div>)([\s\S]*?)(?=<main|<section|<\!--|<\/header|<div class="bg-\[#eaf1fb\]|<div class="bg-brand-navy)/i;
        
        const match = content.match(statsRegex);
        if (match) {
            const fullMatch = match[0];
            const imgSrc = match[2];
            const trailingText = match[3];
            
            // Clean up the Stats Section content
            const cleanStatsSection = `<!-- Stats Section -->
    <section class="py-16 bg-[#edf0f7] max-w-full px-4 sm:px-6 lg:px-8 mt-0">
        <div class="max-w-[1200px] mx-auto">
            <div class="flex flex-col md:flex-row items-center gap-10">
                <!-- Left: Real image collage -->
                <div class="md:w-[50%] mb-10 md:mb-0">
                    <img src="${imgSrc}" alt="Cvent event management collage"
                        class="w-full h-auto rounded-xl">
                </div>
                <!-- Stats -->
                <div class="md:w-[50%] md:pl-8">
                    <div class="grid grid-cols-2 gap-y-12 gap-x-10">
                        <div>
                            <div class="text-[42px] font-medium text-brand-dark mb-1">8M+</div>
                            <div class="text-[15px] text-gray-800 tracking-wide font-medium">events managed</div>
                        </div>
                        <div>
                            <div class="text-[42px] font-medium text-brand-dark mb-1">350M+</div>
                            <div class="text-[15px] text-gray-800 tracking-wide font-medium">registrations processed
                            </div>
                        </div>
                        <div>
                            <div class="text-[42px] font-medium text-brand-dark mb-1">1K+</div>
                            <div class="text-[15px] text-gray-800 tracking-wide font-medium">5-star ratings on G2</div>
                        </div>
                        <div>
                            <div class="text-[42px] font-medium text-brand-dark mb-1">24/7</div>
                            <div class="text-[15px] text-gray-800 tracking-wide font-medium">customer support</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    `;
            
            // We want to replace fullMatch with cleanStatsSection
            // Also, if the next block was </header>, we need to remove the stray </header> tag.
            // Let's see what is after the match in the content
            const endOfMatchIndex = match.index + fullMatch.length;
            let restOfContent = content.substring(endOfMatchIndex);
            
            // If the rest of content starts with </header>, strip it!
            if (restOfContent.trim().startsWith('</header>')) {
                // Strip the </header>
                const headerIndex = restOfContent.indexOf('</header>');
                restOfContent = restOfContent.substring(headerIndex + '</header>'.length);
                console.log(`[STRIPPED STRAY HEADER] ${relativePath}`);
            }
            
            const newContent = content.substring(0, match.index) + cleanStatsSection + restOfContent;
            
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                fixedCount++;
                console.log(`[FIXED LAYOUT] ${relativePath}`);
            }
        } else {
            console.log(`[WARN] Stats Section found but could not match structure in ${relativePath}`);
        }
    }
});

console.log(`\nDone! Fixed layout in ${fixedCount} files.`);
