const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.resolve(__dirname, '..'); // E:\Cvent\admin

const directories = ['products', 'event-types', 'resources'];

let fileCount = 0;
let replacementCount = 0;

directories.forEach(dirName => {
    const dirPath = path.join(ADMIN_DIR, dirName);
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (!file.endsWith('.html') || file.includes('.bak')) return;

        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // 1. Remap href="../Cvent.html" -> href="../index.html"
        if (content.includes('href="../Cvent.html"')) {
            content = content.replace(/href="\.\.\/Cvent\.html"/g, 'href="../index.html"');
            updated = true;
            console.log(`[LINK FIX] Replaced href="../Cvent.html" with href="../index.html" in ${dirName}/${file}`);
            replacementCount++;
        }

        // 2. Remap resources logo links from href="#" to href="../index.html"
        // Regex matches <a href="#" followed by up to 120 chars containing <img src="../assets/images/logo.png"
        const logoRegex = /<a\s+href="#"([\s\S]{0,120}?<img\s+src="\.\.\/assets\/images\/logo\.png")/gi;
        if (logoRegex.test(content)) {
            content = content.replace(logoRegex, '<a href="../index.html"$1');
            updated = true;
            console.log(`[LOGO FIX] Replaced logo href="#" with href="../index.html" in ${dirName}/${file}`);
            replacementCount++;
        }

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            fileCount++;
        }
    });
});

console.log(`\n🎉 Execution complete! Modified ${fileCount} files with a total of ${replacementCount} link/logo replacements.`);
