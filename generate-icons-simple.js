// Simple icon generator for PWA - no external dependencies
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for different sizes
const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

function generateSVGIcon(size) {
    const fontSize = Math.floor(size * 0.6);
    const textY = Math.floor(size * 0.6);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00AEEF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1f6feb;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#gradient)" rx="${Math.floor(size * 0.1)}"/>
  <text x="50%" y="${textY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="white" filter="url(#glow)">A</text>
</svg>`;
}

// Generate all icon sizes
sizes.forEach(size => {
    const svgContent = generateSVGIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    
    try {
        fs.writeFileSync(filepath, svgContent);
        console.log(`Generated ${filename}`);
    } catch (error) {
        console.error(`Failed to generate ${filename}:`, error.message);
    }
});

// Generate favicon
const faviconSVG = generateSVGIcon(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSVG);
console.log('Generated favicon.svg');

// Generate manifest icons list
const manifestIcons = sizes.map(size => ({
    src: `icons/icon-${size}x${size}.svg`,
    sizes: `${size}x${size}`,
    type: 'image/svg+xml',
    purpose: 'any maskable'
}));

console.log('\nGenerated icons:');
console.log(JSON.stringify(manifestIcons, null, 2));

console.log('\nIcon generation complete!');
