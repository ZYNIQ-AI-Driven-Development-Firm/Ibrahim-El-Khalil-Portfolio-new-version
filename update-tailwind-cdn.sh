#!/bin/bash

# Script to update Tailwind CDN URL to use Backblaze B2
# Usage: ./update-tailwind-cdn.sh "https://f002.backblazeb2.com/file/your-bucket-name/tailwind-cdn.js"

if [ -z "$1" ]; then
    echo "Usage: $0 <your-backblaze-cdn-url>"
    echo "Example: $0 https://f002.backblazeb2.com/file/your-bucket-name/tailwind-cdn.js"
    exit 1
fi

BACKBLAZE_URL="$1"
CURRENT_CDN="https://cdn.tailwindcss.com"

echo "Updating Tailwind CDN URL..."
echo "From: $CURRENT_CDN"
echo "To: $BACKBLAZE_URL"
echo ""

# Update frontend/public/index.html
if [ -f "frontend/public/index.html" ]; then
    sed -i.bak "s|$CURRENT_CDN|$BACKBLAZE_URL|g" frontend/public/index.html
    echo "✅ Updated frontend/public/index.html"
else
    echo "❌ frontend/public/index.html not found"
fi

# Update frontend/build/index.html if it exists
if [ -f "frontend/build/index.html" ]; then
    sed -i.bak "s|$CURRENT_CDN|$BACKBLAZE_URL|g" frontend/build/index.html
    echo "✅ Updated frontend/build/index.html"
else
    echo "⚠️ frontend/build/index.html not found (this is normal if you haven't built yet)"
fi

# Update index.html in root if it exists
if [ -f "index.html" ]; then
    sed -i.bak "s|$CURRENT_CDN|$BACKBLAZE_URL|g" index.html
    echo "✅ Updated index.html"
else
    echo "⚠️ index.html not found in root"
fi

echo ""
echo "🎉 CDN URL update complete!"
echo "You can now remove the .bak backup files if everything looks good:"
echo "rm -f frontend/public/index.html.bak frontend/build/index.html.bak index.html.bak"