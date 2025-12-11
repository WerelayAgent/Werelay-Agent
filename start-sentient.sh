#!/bin/bash

# Start Warelay Sentient Agent on Twitter
# This script helps configure and launch the sentient agent

set -e

echo "🤖 Warelay Sentient Agent Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
fi

# Check for Anthropic API key
if ! grep -q "ANTHROPIC_API_KEY=sk-" .env; then
    echo "⚠️  Anthropic API key not configured in .env"
    echo ""
    echo "Please get your API key from: https://console.anthropic.com/settings/keys"
    echo ""
    read -p "Enter your Anthropic API key (or press Enter to skip): " api_key
    
    if [ ! -z "$api_key" ]; then
        # Update the .env file
        if grep -q "ANTHROPIC_API_KEY=" .env; then
            sed -i.bak "s|ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=$api_key|" .env
        else
            echo "ANTHROPIC_API_KEY=$api_key" >> .env
        fi
        echo "✅ API key saved to .env"
    else
        echo "⚠️  Skipping API key setup. You'll need to add it manually to .env"
    fi
    echo ""
fi

# Check Twitter credentials
if ! grep -q "TWITTER_API_KEY=hoF2Aao5YpDnd9GEkMcEDCgNm" .env; then
    echo "⚠️  Twitter credentials not configured!"
    echo "Please add your Twitter API credentials to .env"
    echo "Get them from: https://developer.twitter.com/en/portal/dashboard"
    echo ""
    exit 1
fi

echo "📋 Configuration Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Show enabled features
echo "✅ Twitter: Enabled"

if grep -q "ANTHROPIC_API_KEY=sk-" .env; then
    echo "✅ Claude: Configured"
else
    echo "⚠️  Claude: Not configured (sentient features disabled)"
fi

if grep -q "ENABLE_PREDICTIONS=true" .env; then
    echo "✅ Predictions: Enabled"
else
    echo "❌ Predictions: Disabled"
fi

if grep -q "ENABLE_POLYMARKET=true" .env; then
    echo "✅ Polymarket: Enabled"
else
    echo "❌ Polymarket: Disabled"
fi

if grep -q "ENABLE_TRADING=true" .env; then
    echo "✅ Trading: Enabled"
else
    echo "❌ Trading: Disabled (recommended for safety)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ask to start
read -p "Start Warelay sentient agent now? (y/n): " start_now

if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
    echo ""
    echo "🚀 Starting Warelay sentient agent..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    npm run sentient
else
    echo ""
    echo "To start the agent later, run:"
    echo "  npm run sentient"
    echo ""
    echo "Or use this script again:"
    echo "  bash start-sentient.sh"
    echo ""
fi
