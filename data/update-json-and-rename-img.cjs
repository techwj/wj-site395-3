const { siteSEOInfo, categories } = require("./index.cjs");
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(process.cwd(), '..');

// Define the categories directory and file path
const categoriesDir = path.join(rootDir, 'content', 'categories');
const categoriesFilePath = path.join(categoriesDir, 'index.json');

const categoriesData = {
  siteSEOInfo,
  categories
}

// Create the categories directory if it doesn't exist
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

fs.writeFileSync(categoriesFilePath, JSON.stringify(categoriesData, null, 2));


console.log('Categories index.json has been generated successfully!')



// rename public/images/categories下的图片(除了default.webp)
const sourceDir = path.join(process.cwd(), '..', 'public', 'images', 'categories');

// Get all webp files except default.webp
const imageFiles = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('.webp') && file !== 'default.webp');

// Get all slugs from categories
const newNames = categories.map(category => `${category.slug}.webp`);

// Rename files
imageFiles.forEach((oldName, index) => {
  if (index < newNames.length) {
    const oldPath = path.join(sourceDir, oldName);
    const newPath = path.join(sourceDir, newNames[index]);
    
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldName} -> ${newNames[index]}`);
    }
  }
});

console.log('Image renaming completed!'); 








