# WhatsApp Setup

Deploy your Warelay agent on WhatsApp using Twilio.

## Prerequisites

- Twilio account ([Sign up](https://www.twilio.com/try-twilio))
- WhatsApp-enabled phone number
- Anthropic API key

## Step 1: Get Twilio Credentials

1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Navigate to Console Dashboard
3. Copy your **Account SID** and **Auth Token**

## Step 2: Enable WhatsApp

1. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the instructions to connect your WhatsApp Sandbox
3. Note your WhatsApp-enabled number (e.g., `whatsapp:+14155238886`)

## Step 3: Configure Warelay

Add to your `.env`:

```bash
# Twilio WhatsApp
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# AI Model
ANTHROPIC_API_KEY=sk-ant-...
```

## Step 4: Set Up Webhook

Warelay needs to receive incoming messages via webhook.

### Local Development (Tailscale Funnel)

```bash
npm run webhook -- --ingress tailscale
```

This will output a public URL like:
```
https://your-machine.tailnet-name.ts.net/webhook
```

### Production (Deploy to Server)

Deploy Warelay to a server and use its public URL:
```
https://your-domain.com/webhook
```

## Step 5: Configure Twilio Webhook

1. In Twilio Console, go to **Messaging** → **Settings** → **WhatsApp Sandbox**
2. Set **When a message comes in** to your webhook URL
3. Method: `POST`
4. Save

## Step 6: Start Your Agent

```bash
npm run whatsapp
# or for full agent
npm run sentient
```

## Testing

Send a WhatsApp message to your Twilio number. The agent should respond!

## Features

### Media Support
Send and receive images, videos, documents:
```typescript
// Agent automatically handles media
// No additional config needed
```

### Session Management
Persistent conversations per user:
```typescript
// Automatic session tracking
// Stored in ~/.warelay/sessions/
```

### Group Messages
Reply to group messages (if enabled):
```bash
WHATSAPP_ENABLE_GROUPS=true
```

## Troubleshooting

### "Webhook not receiving messages"
- Verify webhook URL is publicly accessible
- Check Twilio webhook logs
- Ensure webhook URL ends with `/webhook`

### "Authentication failed"
- Double-check Account SID and Auth Token
- Ensure no spaces in `.env` file

### "Message not sending"
- Verify phone number format: `whatsapp:+1234567890`
- Check Twilio account balance
- Review Twilio error logs

## Production Setup

For production WhatsApp Business API:

1. Apply for WhatsApp Business API access
2. Get approved phone number
3. Update configuration:

```bash
TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
WHATSAPP_BUSINESS_MODE=true
```

## Cost

WhatsApp messaging via Twilio:
- **Sandbox**: Free for testing
- **Business API**: ~$0.005-0.01 per message
- Check [Twilio pricing](https://www.twilio.com/whatsapp/pricing)

## Next Steps

- [Configure personality](../features/personality.md)
- [Enable auto-replies](../configuration.md#auto-reply-settings)
- [Add media handling](../advanced/media-handling.md)
