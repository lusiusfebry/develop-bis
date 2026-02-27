const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src/pages/hr');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Ganti background card/glass
    content = content.replace(/bg-white\/5/g, 'bg-card');
    content = content.replace(/border-white\/10/g, 'border-border/50');
    content = content.replace(/border-white\/20/g, 'border-border');
    content = content.replace(/border-white\/30/g, 'border-border/80');
    content = content.replace(/hover:bg-white\/10/g, 'hover:bg-accent');
    content = content.replace(/hover:border-white\/20/g, 'hover:border-border');
    content = content.replace(/hover:border-white\/30/g, 'hover:border-border');
    content = content.replace(/hover:bg-white\/20/g, 'hover:bg-accent/80');
    content = content.replace(/bg-white\/10/g, 'bg-accent/50');

    // Ganti text-neutral
    content = content.replace(/text-neutral-400/g, 'text-muted-foreground');
    content = content.replace(/text-neutral-500/g, 'text-muted-foreground/80');
    content = content.replace(/text-neutral-300/g, 'text-muted-foreground');
    content = content.replace(/placeholder:text-neutral-500/g, 'placeholder:text-muted-foreground');

    // Focus ring
    content = content.replace(/focus:border-white\/30/g, 'focus:border-border');
    content = content.replace(/focus:ring-white\/20/g, 'focus:ring-ring/50');

    // Ganti text-white spesifik pada Header/Typography, tapi biarkan di Button gradient
    // Ini matching specifically `<h... text-white`
    content = content.replace(/(<h[1-6][^>]*?)text-white([^>]*?>)/g, '$1text-foreground$2');

    // Ganti spesifik text-white di p, span, div, dll di list/cards yang background-nya bukan gradient warna
    // Agak tricky, kita replace spesifik strings
    content = content.replace(/text-white truncate/g, 'text-foreground truncate');
    content = content.replace(/text-sm text-white focus:outline-none/g, 'text-sm text-foreground focus:outline-none');
    content = content.replace(/text-sm focus:outline-none/g, 'text-sm focus:outline-none'); // cleanup
    content = content.replace(/text-white hover:bg-white\/10/g, 'text-foreground hover:bg-accent');
    content = content.replace(/text-neutral-400 hover:text-white/g, 'text-muted-foreground hover:text-foreground');
    content = content.replace(/text-white rounded-2xl/g, 'text-foreground rounded-2xl');
    // Khusus form inputs export page
    content = content.replace(/\]:text-white/g, ']:text-foreground');
    content = content.replace(/\]:bg-neutral-900/g, ']:bg-popover');
    // text-white di td / th? master data pake Shared component

    // Modal bg
    content = content.replace(/bg-\[\#0a0a0f\]/g, 'bg-background');
    content = content.replace(/bg-neutral-900\/50/g, 'bg-background/80');
    content = content.replace(/bg-neutral-900/g, 'bg-popover'); // usually for options/modals

    // Loading screen text
    content = content.replace(/text-center text-white/g, 'text-center text-muted-foreground');

    content = content.replace(/text-white transition-all/g, 'text-foreground transition-all');

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
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

walkDir(directoryPath);
console.log('Replacement complete.');
