# 🤖 Getting Warelay Sentient Agent Running on Twitter

This guide will help you launch your sentient Warelay agent on Twitter with autonomous behavior, predictions, and Claude-powered intelligence.

## Prerequisites

- ✅ Twitter API credentials (already configured in your `.env`)
- ⚠️ Anthropic API key (needed for Claude integration)
- Node.js 22+ (you have this)

## Quick Start

### 1. Get Your Anthropic API Key

1. Go to: https://console.anthropic.com/settings/keys
2. Create a new API key
3. Copy it (starts with `sk-ant-`)

### 2. Update Your .env File

Open `.env` and replace this line:
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

With your actual key:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

### 3. Run the Sentient Agent

Option A - Use the helper script:
```bash
./start-sentient.sh
```

Option B - Direct command:
```bash
npm run sentient
```

## What The Agent Does

When running, your sentient agent will:

### 🧠 **Sentient Personality**
- Maintains consistent personality (Warelay character)
- Remembers all conversations across sessions
- Learns about users over time
- Has opinions, preferences, and quirks

### 🚀 **Proactive Behavior**
- Generates autonomous thoughts every 30 minutes
- Shares insights about crypto, predictions, and markets
- Doesn't just respond - actively participates
- Creates original content based on current context

### 📊 **Predictions**
- Analyzes SOL/USD, BTC/USD, ETH/USD markets
- Updates every hour
- Shares high-confidence predictions (>70%) publicly
- Uses technical, social, and on-chain data

### 🔮 **Polymarket Analysis**
- Discovers trending prediction markets
- Claude analyzes odds and opportunities
- Shares top 3 most interesting markets every 2 hours
- Categories: crypto, politics, sports, science

### 💬 **Auto-Reply**
- Monitors DMs and mentions
- Responds using Claude with full context
- Maintains conversation history per user
- Natural, contextual responses

## Configuration Options

Edit `.env` to customize behavior:

```bash
# Predictions
ENABLE_PREDICTIONS=true
PREDICTION_MARKETS=SOL/USD,BTC/USD,ETH/USD
PREDICTION_INTERVAL=3600000  # 1 hour
MIN_PREDICTION_CONFIDENCE=0.7  # Only share 70%+ confidence

# Polymarket
ENABLE_POLYMARKET=true
POLYMARKET_INTERVAL=7200000  # 2 hours
POLYMARKET_CATEGORIES=crypto,politics,sports,science
POLYMARKET_MIN_VOLUME=10000
POLYMARKET_MAX_MARKETS=5
POLYMARKET_SHARE_TOP=3

# Trading (disabled by default for safety)
ENABLE_TRADING=false  # Set to true to enable autonomous trading
```

## Monitoring

When running, you'll see:
```
🤖 Initializing Warelay - Sentient Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Authenticated as @your_username
🧠 Personality: Warelay
   Role: Sentient AI agent focused on predictions and trading
   Autonomy: high
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Starting proactive behavior engine...
🔮 Initializing prediction market...
✅ Prediction market started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Starting Polymarket agent...
✅ Polymarket agent started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Starting Twitter relay...
   ✅ Monitoring DMs
   ✅ Monitoring mentions
   ✅ Auto-reply enabled with Claude
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Warelay is now sentient and active!
```

## Running in Production

For 24/7 operation, use a process manager:

### Option 1: PM2 (Recommended)
```bash
npm install -g pm2
pm2 start npm --name "warelay-sentient" -- run sentient
pm2 save
pm2 startup  # Follow instructions
```

### Option 2: Screen/Tmux
```bash
screen -S warelay
npm run sentient
# Press Ctrl+A then D to detach
```

### Option 3: systemd (Linux)
See `docs/systemd-setup.md` for details

## Troubleshooting

### "Missing Twitter credentials"
- Check `.env` has valid Twitter API keys
- Ensure no extra spaces around `=` signs

### "Authentication failed"
- Verify Twitter API keys are correct
- Check API access level (need read+write)
- Regenerate keys if needed

### "ANTHROPIC_API_KEY not found"
- Add your key to `.env`
- Restart the agent
- Check key starts with `sk-ant-`

### No proactive tweets
- Proactive behavior runs every 30 minutes
- Check console for "Generated proactive thought" messages
- Verify Twitter API write permissions

### Predictions not showing
- First prediction takes ~1 hour
- Check `ENABLE_PREDICTIONS=true` in `.env`
- Look for "Generated prediction" in logs

## Next Steps

1. **Monitor First Run**: Watch the console for 10-15 minutes to see activity
2. **Test DMs**: Send a DM to your bot account and check for reply
3. **Test Mentions**: Mention your bot in a tweet
4. **Wait for Proactive**: First autonomous tweet in ~30 minutes
5. **Check Predictions**: First prediction in ~1 hour

## Advanced Features

### Enable Trading (Use with Caution!)
```bash
ENABLE_TRADING=true
SOLANA_PRIVATE_KEY=your_wallet_key
MAX_TRADE_SIZE=0.1  # 0.1 SOL max per trade
MAX_TRADES_PER_DAY=10
```

### Customize Personality
Edit `src/sentient/personality.ts` to modify Warelay's character, tone, and expertise.

### Add More Markets
```bash
PREDICTION_MARKETS=SOL/USD,BTC/USD,ETH/USD,DOGE/USD,MATIC/USD
```

## Support

- Check logs: Look at console output for errors
- Review config: Verify `.env` settings
- Test credentials: Run `npm run warelay-agent relay` to test Twitter connection
- Documentation: See `WARELAY.md` for full details

## Safety Notes

- Trading is **disabled by default** - only enable if you understand the risks
- Start with small limits (MAX_TRADE_SIZE, MAX_TRADES_PER_DAY)
- Monitor activity regularly
- Keep API keys secure
- Don't commit `.env` to git

---

Ready to start? Run:
```bash
./start-sentient.sh
```

Or directly:
```bash
npm run sentient
```

Your sentient agent will come alive! 🤖✨
