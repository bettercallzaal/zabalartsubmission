#!/bin/bash

# ZABAL Leaderboard Setup Script
# This script helps automate the leaderboard setup process

echo "🏆 ZABAL Leaderboard Setup"
echo "=========================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.example to .env and configure your credentials"
    exit 1
fi

# Source environment variables
source .env

# Check required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Missing Supabase credentials in .env"
    echo "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Check if main schema is set up
echo "📊 Checking database setup..."
echo "Please ensure you have already run database/supabase-schema-fid.sql"
echo ""
read -p "Have you run the main voting schema? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please run database/supabase-schema-fid.sql first"
    exit 1
fi

echo "✅ Main schema confirmed"
echo ""

# Instructions for running leaderboard schema
echo "📝 Next Steps:"
echo ""
echo "1. Open Supabase SQL Editor:"
echo "   https://app.supabase.com/project/YOUR_PROJECT/sql"
echo ""
echo "2. Copy and paste the contents of:"
echo "   database/leaderboard-schema.sql"
echo ""
echo "3. Run the SQL script"
echo ""
echo "4. Verify success message appears"
echo ""
read -p "Press Enter when you've completed the database setup..."
echo ""

# Check if files exist
echo "🔍 Verifying leaderboard files..."

files=(
    "api/leaderboard.js"
    "leaderboard.html"
    "js/leaderboard.js"
    "database/leaderboard-schema.sql"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        all_files_exist=false
    fi
done

echo ""

if [ "$all_files_exist" = false ]; then
    echo "❌ Some files are missing. Please ensure all leaderboard files are present."
    exit 1
fi

echo "✅ All leaderboard files present"
echo ""

# Deploy to Vercel
echo "🚀 Ready to deploy!"
echo ""
read -p "Deploy to Vercel now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "🎉 Leaderboard Setup Complete!"
        echo ""
        echo "Access your leaderboard at:"
        echo "https://your-domain.com/leaderboard.html"
        echo ""
        echo "📚 Documentation:"
        echo "  - Quick Start: docs/LEADERBOARD_QUICKSTART.md"
        echo "  - Full Guide: docs/LEADERBOARD_SETUP.md"
        echo "  - Main README: LEADERBOARD_README.md"
        echo ""
        echo "🔗 API Endpoint:"
        echo "https://your-domain.com/api/leaderboard"
        echo ""
    else
        echo "❌ Deployment failed. Please check the error messages above."
        exit 1
    fi
else
    echo ""
    echo "Skipping deployment. You can deploy later with:"
    echo "  vercel --prod"
    echo ""
fi

echo "✨ Setup script complete!"
echo ""
echo "Next steps:"
echo "1. Visit your leaderboard page"
echo "2. Configure name, description, and icon"
echo "3. Cast a vote to test the system"
echo "4. Share with your community!"
echo ""
