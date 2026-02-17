#!/bin/bash

# Configuration
SOURCE_DIR="/home/ucon/esg"
TARGET_DIR="/var/www/esg"

echo "🚀 Starting ESG Website Deployment..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"

# 1. Create Target Directory
if [ ! -d "$TARGET_DIR" ]; then
    echo "📂 Creating target directory: $TARGET_DIR"
    sudo mkdir -p "$TARGET_DIR"
else
    echo "🧹 Cleaning existing target directory..."
    sudo rm -rf "$TARGET_DIR"/*
fi

# 2. Copy Whitelisted Files & Folders
echo "📦 Copying files..."

# Function to copy if exists
safe_copy() {
    if [ -e "$SOURCE_DIR/$1" ]; then
        echo "   -> Copying $1"
        sudo cp -r "$SOURCE_DIR/$1" "$TARGET_DIR/"
    else
        echo "   ⚠️ Warning: $1 not found in source."
    fi
}

# Copy Assets
safe_copy "css"
safe_copy "js"
safe_copy "images"
safe_copy "sounds"
safe_copy "pages"
safe_copy "includes"
safe_copy "index.html"
safe_copy "favicon.ico" # If exists
safe_copy "aitg" # Telegram WebApp folder

# 3. Clean up generic junk from subdirectories (if any copied by accident)
# (Since we copied specific folders, we only need to clean inside them if they strictly contain junk)
# But whitelist copy prevents root junk. 
# We should check if 'pages' or 'js' contains junk.
# Exclude test files from copied directories
echo "🧹 Removing development files from target..."
sudo find "$TARGET_DIR" -name "*.md" -type f -delete
sudo find "$TARGET_DIR" -name "*.py" -type f -delete
sudo find "$TARGET_DIR" -name "*.sh" -type f -delete
sudo find "$TARGET_DIR" -name "*.sql" -type f -delete
sudo find "$TARGET_DIR" -name "*.zip" -type f -delete
sudo find "$TARGET_DIR" -name "test-*.html" -type f -delete
sudo find "$TARGET_DIR" -name "*-test.html" -type f -delete
sudo find "$TARGET_DIR" -name "force-login.html" -type f -delete
sudo find "$TARGET_DIR" -name "deploy.html" -type f -delete

# 4. Set Permissions
echo "🔒 Setting permissions..."
sudo chown -R ucon:ucon "$TARGET_DIR"
sudo find "$TARGET_DIR" -type d -exec chmod 755 {} \;
sudo find "$TARGET_DIR" -type f -exec chmod 644 {} \;

# 5. Reload Caddy & Restart Server
echo "🔄 Reloading Caddy..."
sudo systemctl reload caddy
echo "🔄 Restarting ESG API..."
pm2 restart esg-api

echo "✅ Deployment Complete!"
echo "   URL: https://uconai.ddns.net/esg/"
