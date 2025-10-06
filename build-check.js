#!/usr/bin/env node

// Скрипт для проверки совместимости кода перед сборкой
const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка совместимости кода...');

// Список файлов для проверки
const filesToCheck = [
  './services/emailService.ts',
  './config/email.ts',
  './utils/emailCheck.ts',
  './utils/envUtils.ts'
];

let hasErrors = false;

// Проверяем на наличие опциональной цепочки в проблемных местах
filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Проверяем на потенциально проблемные конструкции
    const problematicPatterns = [
      /import\.meta\?\./g,
      /import\?\./g,
      /process\.env\?\./g,
      /typeof import !== 'undefined'/g
    ];
    
    problematicPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        console.error(`❌ Найдена потенциально проблемная конструкция в ${filePath}:`);
        matches.forEach(match => {
          console.error(`   ${match}`);
        });
        hasErrors = true;
      }
    });
    
    console.log(`✅ ${filePath} - проверен`);
  } else {
    console.warn(`⚠️ Файл не найден: ${filePath}`);
  }
});

if (hasErrors) {
  console.error('\n❌ Обнаружены потенциальные проблемы сборки!');
  console.error('Замените опциональную цепочку (?.) на явные проверки.');
  process.exit(1);
} else {
  console.log('\n✅ Все файлы готовы к сборке!');
}