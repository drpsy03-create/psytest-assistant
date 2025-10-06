#!/usr/bin/env node

// Скрипт для исправления проблем сборки
const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление импортов для сборки...');

// Функция для рекурсивного поиска файлов
function findFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat && stat.isDirectory()) {
      // Пропускаем node_modules
      if (file !== 'node_modules' && file !== 'dist' && file !== 'build') {
        results = results.concat(findFiles(fullPath, ext));
      }
    } else if (file.endsWith(ext)) {
      results.push(fullPath);
    }
  });
  
  return results;
}

// Найти все .tsx файлы
const tsxFiles = findFiles('.', '.tsx');

let fixedFiles = 0;

tsxFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Убираем версии из импортов
    const versionedImportRegex = /@([^\/\s]+)@[\d\.]+/g;
    const newContent = content.replace(versionedImportRegex, '@$1');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Исправлен: ${filePath}`);
      fixedFiles++;
    }
  } catch (error) {
    console.warn(`⚠️ Не удалось обработать ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 Исправлено файлов: ${fixedFiles}`);
console.log('✅ Готово к сборке!');