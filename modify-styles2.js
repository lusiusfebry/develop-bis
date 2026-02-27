const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'frontend/src/components/hr/master'),
    path.join(__dirname, 'frontend/src/components/shared'),
    path.join(__dirname, 'frontend/src/components/ui'),
];

function replaceInFile(filePath) {
    if (filePath.includes('button-variants.ts')) return; // skip this file

    let content = fs.readFileSync(filePath, 'utf8');

    // Background card/glass
    content = content.replace(/bg-white\/5/g, 'bg-card/50');
    content = content.replace(/bg-white\/15/g, 'bg-accent');
    content = content.replace(/bg-white\/10/g, 'bg-accent/50');
    content = content.replace(/border-white\/10/g, 'border-border/50');
    content = content.replace(/border-white\/20/g, 'border-border');
    content = content.replace(/border-white\/30/g, 'border-border/80');
    content = content.replace(/hover:bg-white\/10/g, 'hover:bg-accent');
    content = content.replace(/hover:border-white\/20/g, 'hover:border-border');
    content = content.replace(/hover:border-white\/30/g, 'hover:border-border/80');
    content = content.replace(/hover:bg-white\/20/g, 'hover:bg-accent/80');
    content = content.replace(/focus:border-white\/30/g, 'focus:border-border');
    content = content.replace(/focus:border-indigo-500\/50/g, 'focus:border-indigo-500'); // keep logic
    content = content.replace(/focus:ring-white\/20/g, 'focus:ring-ring/50');
    content = content.replace(/hover:bg-white\/5/g, 'hover:bg-accent/30');
    content = content.replace(/focus:ring-indigo-500\/25/g, 'focus:ring-indigo-500/25');

    // Text colors
    content = content.replace(/text-neutral-400/g, 'text-muted-foreground');
    content = content.replace(/text-neutral-500/g, 'text-muted-foreground/80');
    content = content.replace(/text-neutral-300/g, 'text-muted-foreground');
    content = content.replace(/placeholder:text-neutral-500/g, 'placeholder:text-muted-foreground/80');

    // text-white generic replacements
    content = content.replace(/text-white\/30/g, 'text-muted-foreground/30');
    content = content.replace(/text-white\/50/g, 'text-muted-foreground/50');
    content = content.replace(/text-white\/70/g, 'text-muted-foreground/70');
    content = content.replace(/text-white\/90/g, 'text-foreground/90');

    // Khusus text-white yg bukan didalam bg-gradient
    content = content.replace(/text-sm text-white/g, 'text-sm text-foreground');
    content = content.replace(/text-lg font-semibold text-white/g, 'text-lg font-semibold text-foreground');
    content = content.replace(/border-none text-white/g, 'border-none text-foreground'); // DialogContent
    content = content.replace(/hover:text-white/g, 'hover:text-foreground');

    // Modal bg
    content = content.replace(/bg-neutral-900\/50/g, 'bg-background/80');
    content = content.replace(/bg-neutral-900/g, 'bg-popover');

    // Combobox specific
    content = content.replace(/border-white\/10 text-white/g, 'border-border/50 text-foreground');
    content = content.replace(/text-white font-medium/g, 'text-foreground font-medium');

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
            console.log('Updated', fullPath);
        }
    }
}

targetDirs.forEach(dir => walkDir(dir));
console.log('Replacement complete.');
