#!/bin/bash

# Build script for Soho Showcase project
echo "🚀 Building Soho Showcase..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Create dist directory
mkdir -p dist

# Build main showcase
echo "🎨 Building main showcase..."
npx canvas-sketch-cli sketches/main.js --build --dir dist --name index

# Copy all project assets (data, config, containers, phases, utils folders)
echo "📂 Copying project assets..."
for dir in data config containers phases utils; do
  if [ -d "$dir" ]; then
    cp -r "$dir" dist/
  fi
done

echo "✅ Build complete! Your main showcase is ready."

echo "✅ Build complete! Files are in the 'dist' folder."
echo "📂 Built files:"
ls -la dist/

echo ""
echo "🌐 To test locally:"
echo "   npx http-server dist -p 8080"
echo "   Then visit http://localhost:8080"