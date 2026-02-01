const fs = require('fs');
const path = require('path');

// Read the NBA.jsx file
const filePath = path.join(__dirname, 'src', 'NBA', 'NBA.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all class= with className=
content = content.replace(/\sclass="/g, ' className="');

// Convert inline style strings to objects
// Match style="..." patterns
content = content.replace(/style="([^"]*)"/g, (match, styleString) => {
  // Parse the style string into a JavaScript object
  const styles = styleString.split(';')
    .filter(s => s.trim())
    .map(s => {
      const [property, value] = s.split(':').map(p => p.trim());
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      return `${camelProperty}:"${value}"`;
    });
  
  return `style={{${styles.join(',')}}}`;
});

// Write the converted content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Conversion complete!');
console.log('- Replaced all class= with className=');
console.log('- Converted all inline styles to JSX objects');
