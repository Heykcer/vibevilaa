import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import babel from '@babel/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    const ext = filePath.endsWith('.tsx') ? '.jsx' : '.js';
    const newFilePath = filePath.replace(/\.tsx?$/, ext);
    
    console.log(`Transpiling ${filePath} -> ${newFilePath}`);
    
    const result = babel.transformFileSync(filePath, {
      presets: [
        ['@babel/preset-typescript', { isTSX: filePath.endsWith('.tsx'), allExtensions: true }]
      ],
      retainLines: true,
      generatorOpts: {
        retainLines: true,
        compact: false,
      }
    });

    if (result && result.code) {
      fs.writeFileSync(newFilePath, result.code);
      fs.unlinkSync(filePath); // delete original TS file
    }
  }
});
