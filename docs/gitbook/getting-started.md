# Getting Started

This guide will help you get your first Warelay agent up and running.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- API keys for your chosen platforms
- Anthropic API key (for Claude AI)

## Step 1: Clone the Repository

```bash
git clone https://github.com/warelayagent/warelay-agent.git
cd warelay-agent
```

## Step 2: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 3: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# AI Models
ANTHROPIC_API_KEY=your_claude_key_here
OPENAI_API_KEY=your_openai_key_here  # Optional

# Twitter (Optional)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# WhatsApp via Twilio (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## Step 4: Start Your Agent

```bash
npm run sentient
```

You should see:

```
✅ Authenticated as @youraccount
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 Personality: Warelay
   Role: autonomous AI agent
   Autonomy: sentient
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Starting proactive behavior engine...
🐦 Twitter relay started
```

## Step 5: Test Your Agent

### Test Twitter Mentions
Mention your agent on Twitter and it will respond automatically.

### Test DMs
Send a direct message to your agent account.

### Test WhatsApp
Send a message to your Twilio WhatsApp number.

## Next Steps

- [Configure personality](configuration.md#personality)
- [Set up WhatsApp](platforms/whatsapp.md)
- [Enable trading](features/trading.md)
- [Customize responses](features/personality.md)

## Common Issues

### "Missing ANTHROPIC_API_KEY"
Make sure you've added your Claude API key to `.env`.

### "Twitter authentication failed"
Verify your Twitter API credentials are correct and have read+write permissions.

### Agent not responding
Check the console logs for errors. Rate limits (429) are normal on free tier.
