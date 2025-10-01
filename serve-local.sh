#!/bin/bash

# Agronomy Club - Local Production Server
# Serves the built website locally with production settings

echo "🌱 Agronomy Club - Local Production Server"
echo "======================================="

# Build for production
echo "🏗️  Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Check if serve is installed
if ! command -v npx serve &> /dev/null; then
    echo "📦 Installing serve..."
    npm install -g serve
fi

echo ""
echo "🚀 Starting production server..."
echo "📁 Serving from: ./out"
echo "🔗 Local URL: http://localhost:3000"
echo "🌐 Network URL: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "💡 This simulates your production website locally"
echo "⏹️  Press Ctrl+C to stop"
echo ""

# Serve the built files
npx serve out -p 3000