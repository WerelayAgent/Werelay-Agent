# Configuration

Comprehensive guide to configuring your Warelay agent.

## Environment Variables

### Required

```bash
# Claude AI (Required)
ANTHROPIC_API_KEY=sk-ant-...
```

### Platform Credentials

#### Twitter
```bash
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_SECRET=your_token_secret
```

#### WhatsApp (via Twilio)
```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

#### Telegram
```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_MAX_DAILY_GENS=20  # For art bot
```

### Features

#### Predictions
```bash
ENABLE_PREDICTIONS=true
PREDICTION_MARKETS=SOL/USD,BTC/USD,ETH/USD
PREDICTION_INTERVAL=3600000  # 1 hour
MIN_PREDICTION_CONFIDENCE=0.7
```

#### Trading (Use with Caution)
```bash
ENABLE_TRADING=false
SOLANA_PRIVATE_KEY=your_wallet_key
MAX_TRADE_SIZE=0.1  # SOL
MAX_TRADES_PER_DAY=10
```

#### Twitter Learning
```bash
ENABLE_TWITTER_LEARNING=true
TWITTER_LEARN_ACCOUNTS=truth_terminal,aixbt_agent,luna_virtuals
TWITTER_LEARNING_INTERVAL=1800000  # 30 minutes
TWITTER_INTERACTION_PROBABILITY=0.2  # 20% chance
```

#### Self-Upgrade System
```bash
ENABLE_SELF_UPGRADE=true
SELF_UPGRADE_INTERVAL=86400000  # 24 hours
AUTO_APPROVE_CONFIG=true
AUTO_APPROVE_PROMPTS=true
REQUIRE_HUMAN_CODE_APPROVAL=true
```

## Personality

Edit `src/sentient/personality.ts` to customize your agent's character:

```typescript
export const WARELAY_PERSONALITY = {
  name: "Warelay",
  role: "autonomous AI agent",
  autonomyLevel: "sentient",
  traits: [
    "analytical",
    "proactive",
    "transparent"
  ],
  voice: {
    style: "casual",
    tone: "friendly",
    formality: "low"
  }
};
```

## Auto-Reply Settings

Configure response behavior in `.env`:

```bash
# Twitter monitoring
MONITOR_DMS=true
MONITOR_MENTIONS=true
POLL_INTERVAL=300  # 5 minutes

# Auto-reply
AUTO_REPLY_DMS=true
AUTO_REPLY_MENTIONS=true
```

## Rate Limits

Configure API rate limits:

```bash
MAX_TWEETS_PER_HOUR=50
MAX_DMS_PER_HOUR=100
```

## Deployment Settings

For production:

```bash
NODE_ENV=production
LOG_LEVEL=info
```

For development:

```bash
NODE_ENV=development
LOG_LEVEL=debug
```

## Next Steps

- [Platform-specific setup](platforms/)
- [Enable trading](features/trading.md)
- [Configure predictions](features/predictions.md)
