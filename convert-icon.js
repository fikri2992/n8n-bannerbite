const fs = require('fs');
const path = require('path');

// Simple SVG wrapper for an icon
const createSvg = (iconName) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   version="1.1"
   width="60"
   height="60"
   viewBox="0 0 60 60">
  <image
     width="60"
     height="60"
     xlink:href="data:image/png;base64,${fs.readFileSync(path.join(__dirname, 'icons', iconName)).toString('base64')}"
  />
</svg>`;
};

// Create SVG from icon
const svgContent = createSvg('apple-icon-57x57.png'); // Using the smaller icon for better performance
fs.writeFileSync(path.join(__dirname, 'nodes', 'CustomNode', 'bannerbite.svg'), svgContent);

console.log('SVG icon created successfully!');
