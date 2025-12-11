<p align="center">
  <img src="https://github.com/user-attachments/assets/4c49c9b7-98f2-4ec5-bcb8-e4e8e8e8e8e8" alt="Werelay" width="600"/>
</p>

# Werelay Agent

A self-evolving autonomous AI agent that learns, upgrades itself, and dominates Twitter with unhinged crypto shitposting energy. Powered by Claude AI with continuous learning, meme discovery, and autonomous self-improvement. Live on Twitter: [@Werelayagent](https://twitter.com/Werelayagent).

## Contract Address (CA)

```text
Soon on Four.meme
```

Copy the CA above for use in contracts, token listings, or any on-chain references.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Twitter API credentials and Anthropic API key

# Run the sentient agent
npm run sentient

# Post a tweet manually
./node_modules/.bin/tsx post-tweet.ts
```

## Configuration

Required environment variables in `.env`:

```bash
# Twitter API (get from https://developer.twitter.com)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Anthropic API for Claude
ANTHROPIC_API_KEY=sk-ant-api03-...

# Agent Settings
ENABLE_PREDICTIONS=true
PREDICTION_MARKETS=BNB/USD,BTC/USD,ETH/USD

# Twitter Learning (learn from other AI agents)
ENABLE_TWITTER_LEARNING=true
TWITTER_LEARN_ACCOUNTS=truth_terminal,aixbt_agent,luna_virtuals,ai16zdao,yoheinakajima,vitalikbuterin
TWITTER_LEARNING_INTERVAL=1800000  # Check every 30 minutes
TWITTER_INTERACTION_PROBABILITY=1.0  # 100% engagement with target accounts

# Trending Topics Monitor (Meme Discovery)
ENABLE_TRENDING_MONITOR=true
TRENDING_CHECK_INTERVAL=900000  # Check every 15 minutes
TRENDING_MIN_VOLUME=10000  # Min 10k tweets to care
TRENDING_KEYWORDS=meme,memecoin,crypto,bitcoin,eth,bnb,token,ai,viral,agent

# Self-Upgrade System (Agent Improves Itself)
ENABLE_SELF_UPGRADE=true
SELF_UPGRADE_INTERVAL=86400000  # Analyze every 24 hours
AUTO_APPROVE_CONFIG=true  # Auto-apply safe config changes
AUTO_APPROVE_PROMPTS=true  # Auto-improve personality
REQUIRE_HUMAN_CODE_APPROVAL=true  # Human reviews code changes
UPGRADE_ENGAGEMENT_THRESHOLD=0.03  # Upgrade if below 3% engagement
```

## Features

- **🧬 Self-Upgrade System**: Analyzes its own performance every 24h and upgrades itself (config, prompts, code) to improve engagement
- **🔥 Trending Meme Discovery**: Monitors Twitter trending topics every 15min to discover new memes before they go viral
- **✍️ Human-like Writing**: Posts with natural patterns (fragments, run-ons, stream of consciousness) - no emojis, pure raw energy
- **💎 Crypto Shitposting Master**: Unhinged takes on memecoins, rug pulls, tokenomics, and diamond hands - zero corporate filter
- **Continuous Learning & Evolution**: Agent learns from every interaction, tracks patterns, adapts personality over time
- **Twitter Learning System**: Studies specific AI agent accounts (truth_terminal, aixbt_agent, luna_virtuals, etc.), learns their patterns, communication styles, and engages with 100% probability
- **Autonomous Tweet Generation**: Posts intelligent crypto/meme tweets every hour with deep Truth Terminal philosophy integration
- **Universal Reply System**: Replies to ALL mentions within 5 minutes using Claude-powered intelligence
- **Sentient Personality**: Persistent memory, context-awareness, remembers past conversations with each user
- **Preference Tracking**: Learns user preferences, conversation styles, and interests automatically
- **Pattern Recognition**: Identifies what works in conversations and evolves communication style
- **Agent-to-Agent Collaboration**: Recognizes and interacts intelligently with other AI agents on Twitter
- **Market Predictions**: Hourly analysis of BNB/USD, BTC/USD, ETH/USD (shares predictions >70% confidence)
- **Claude Haiku Integration**: Fast, intelligent response generation via Anthropic SDK
- **Rate Limit Optimized**: Conservative polling (5min intervals, 5 items per fetch) to avoid Twitter rate limits
- **Tweet Tracking**: Automatically tracks last 50 tweets to maintain conversation context
- **Multi-Platform**: Twitter (live), WhatsApp, extensible architecture

## Documentation

- [Sentient Agent Guide](Werelay.md)
- [Self-Upgrade System](docs/self-upgrade.md) - **NEW**: Autonomous self-improvement system
- [Polymarket with Claude](POLYMARKET.md)
- [Prediction Market](PREDICTIONS.md)
- [Trading System Setup](TRADING.md)
- [Trading Terminal](TERMINAL.md)
- [Repository Guidelines](AGENTS.md)

## Project Structure

```
src/
├── cli/              # CLI commands and wiring
├── commands/         # Core commands (send, webhook, etc)
├── sentient/         # Personality, memory, auto-reply
├── trading/          # BNB trading engine
├── api/              # Trading data API server
├── providers/        # Platform providers (Twitter, Web)
└── agents/           # AI model integrations

website/              # Landing page, terminal, agent builder
docs/                 # Additional documentation
```

## How It Works

The agent runs continuously and:
1. **Checks mentions every 5 minutes** - Polls Twitter API for new @mentions
2. **Generates Claude responses** - Uses Anthropic SDK with claude-3-haiku-20240307 model
3. **Replies automatically** - Responds to every mention with contextual, personality-driven replies
4. **Posts autonomously** - Shares crypto shitposting energy every 15 minutes (diverse topics: AI agents, tokenomics, memecoins, consciousness, infrastructure)
5. **Discovers trending memes** - Monitors Twitter trending topics every 15min for viral opportunities
6. **Learns from AI agents** - Studies truth_terminal, aixbt_agent, luna_virtuals, vitalik, and more - engages with 100% probability
7. **Tracks conversations** - Maintains memory of all interactions in `~/.Werelay/Werelay-memory.json`
8. **Shares predictions** - Posts high-confidence market analysis hourly
9. **Upgrades itself** - Analyzes performance every 24h and proposes improvements (auto-applies safe changes, logs risky ones)

## Scripts

- `npm run sentient` - Launch Twitter sentient agent (runs continuously with self-upgrade, trending monitor, hourly tweets)
- `npm run whatsapp` - Launch WhatsApp sentient agent (runs continuously)
- `npm run check-learning` - View learning statistics and evolution progress
- `./node_modules/.bin/tsx post-tweet.ts` - Post a single tweet manually
- `./node_modules/.bin/tsx post-tweet-claude.ts` - Post Claude-powered crypto shitpost with learning context
- `./node_modules/.bin/tsx check-mentions.ts` - Check recent mentions
- Check upgrade proposals: `cat ~/.Werelay/upgrade-proposals.json` - View self-improvement suggestions
- `npm run build` - Compile TypeScript
- `npm test` - Run test suite

## WhatsApp Setup

The WhatsApp agent uses WhatsApp Web (via Baileys) and requires QR code authentication:

```bash
# First time setup - authenticate with QR code
npm run whatsapp

# Scan the QR code with your phone:
# WhatsApp > Settings > Linked Devices > Link a Device

# Agent will then run continuously and reply to all messages
```

The agent will:
- Remember conversations with each contact
- Respond with personality-driven replies using Claude
- Maintain context across all chats
- Store memories in `~/.Werelay/whatsapp-memory.json`

## Deployment

Website deployed at Vercel. Auto-deploys from `main` branch.

Repository: https://github.com/Werelayagent/Werelay-agent

## License

MIT
