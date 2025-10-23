// Simple icon generator for PWA
const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#00AEEF');
    gradient.addColorStop(1, '#1f6feb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // AeroVista "A" logo
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', size/2, size/2);
    
    return canvas.toBuffer('image/png');
}

// Generate all required icon sizes
const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    try {
        const iconBuffer = generateIcon(size);
        fs.writeFileSync(`icons/icon-${size}x${size}.png`, iconBuffer);
        console.log(`Generated icon-${size}x${size}.png`);
    } catch (error) {
        console.log(`Skipping ${size}x${size} (canvas not available)`);
    }
});

console.log('Icon generation complete!');

