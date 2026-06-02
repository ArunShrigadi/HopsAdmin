const fs = require('fs');

const html = fs.readFileSync('E:/Cvent/index.html', 'utf8');

function extractMenu(tabName) {
    const startPattern = new RegExp(`<button type="button"[^>]*>[\\s\\S]*?${tabName}[\\s\\S]*?</button>\\s*<div class="menu-level--1 dropdown"[^>]*>`, 'i');
    const match = html.match(startPattern);
    if (!match) return null;
    
    let idx = match.index + match[0].length;
    let divCount = 1;
    let endIdx = idx;
    
    while (divCount > 0 && endIdx < html.length) {
        let nextDivOpen = html.indexOf('<div', endIdx);
        let nextDivClose = html.indexOf('</div', endIdx);
        
        if (nextDivClose === -1) break;
        
        if (nextDivOpen !== -1 && nextDivOpen < nextDivClose) {
            divCount++;
            endIdx = nextDivOpen + 4;
        } else {
            divCount--;
            endIdx = nextDivClose + 5;
            if (divCount === 0) {
                break;
            }
        }
    }
    
    return html.substring(match.index + match[0].length, endIdx - 6);
}

let productsMenu = extractMenu('Products');
let eventTypesMenu = extractMenu('Event types');
let resourcesMenu = extractMenu('Resources');

console.log('Products length:', productsMenu ? productsMenu.length : 0);
console.log('Event types length:', eventTypesMenu ? eventTypesMenu.length : 0);
console.log('Resources length:', resourcesMenu ? resourcesMenu.length : 0);

if (eventTypesMenu) {
    fs.writeFileSync('E:/Cvent/extracted_event_types.html', eventTypesMenu);
}
