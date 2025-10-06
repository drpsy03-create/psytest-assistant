#!/bin/bash

echo "🚀 Развертывание PsyTest Assistant"
echo "================================="

# Проверка наличия git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен. Установите Git для продолжения."
    exit 1
fi

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Установите Node.js для продолжения."
    exit 1
fi

echo "📦 Установка зависимостей..."
npm install

echo "🔧 Сборка проекта..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Сборка успешна!"
    
    echo ""
    echo "🌐 Готово к развертыванию!"
    echo ""
    echo "Следующие шаги:"
    echo "1. 📧 Настройте EmailJS (см. DEPLOYMENT.md)"
    echo "2. 🔗 Загрузите код на GitHub"
    echo "3. 🚀 Подключите к Vercel"
    echo ""
    echo "📚 Подробная инструкция: ./DEPLOYMENT.md"
    echo ""
    
    # Предложение автоматического деплоя через Vercel CLI
    if command -v vercel &> /dev/null; then
        read -p "🤖 Развернуть сейчас через Vercel CLI? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🚀 Развертывание через Vercel..."
            vercel --prod
        fi
    else
        echo "💡 Для автодеплоя установите Vercel CLI: npm i -g vercel"
    fi
else
    echo "❌ Ошибка сборки. Проверьте логи выше."
    exit 1
fi