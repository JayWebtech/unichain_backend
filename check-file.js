const fs = require('fs');
const path = require('path');

// Check if the file exists
const filePath = path.join(__dirname, 'src', 'entities', 'verification-log.entity.ts');
const fileExists = fs.existsSync(filePath);

console.log(`Checking file: ${filePath}`);
console.log(`File exists: ${fileExists}`);

// List all files in the entities directory
const entitiesDir = path.join(__dirname, 'src', 'entities');
try {
  const files = fs.readdirSync(entitiesDir);
  console.log('Files in entities directory:');
  files.forEach(file => console.log(` - ${file}`));
} catch (error) {
  console.error(`Error reading directory: ${error.message}`);
}