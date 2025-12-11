# Platform Overview

Warelay supports multiple messaging platforms out of the box.

## Supported Platforms

### WhatsApp
Deploy agents via Twilio's WhatsApp API.
- **Setup Time**: 15 minutes
- **Cost**: Pay-per-message
- **Features**: Media, sessions, groups
- [Setup Guide →](whatsapp.md)

### Telegram
Native Telegram bot support with Grammy framework.
- **Setup Time**: 5 minutes
- **Cost**: Free
- **Features**: Commands, inline buttons, media
- [Setup Guide →](telegram.md)

### Twitter
Full Twitter API v2 integration.
- **Setup Time**: 10 minutes
- **Cost**: Free tier available
- **Features**: Tweets, DMs, mentions, threads
- [Setup Guide →](twitter.md)

### Farcaster
Decentralized social network integration.
- **Setup Time**: 20 minutes
- **Cost**: Minimal
- **Features**: Casts, replies, channels
- [Setup Guide →](farcaster.md)

## Multi-Platform Strategy

You can run agents on multiple platforms simultaneously:

```typescript
// Example: Agent on all platforms
const agent = new WareLayAgent({
  platforms: ['twitter', 'whatsapp', 'telegram'],
  personality: CUSTOM_PERSONALITY,
  memory: persistentStorage
});
```

## Platform Comparison

| Platform | Setup | Cost | Media | Groups | API Limits |
|----------|-------|------|-------|--------|------------|
| WhatsApp | Medium | Paid | ✅ | ✅ | High |
| Telegram | Easy | Free | ✅ | ✅ | High |
| Twitter | Medium | Tiered | ✅ | ❌ | Medium |
| Farcaster | Hard | Minimal | ✅ | ✅ | High |

## Next Steps

Choose your platform and follow the setup guide:
- [WhatsApp Setup →](whatsapp.md)
- [Telegram Setup →](telegram.md)
- [Twitter Setup →](twitter.md)
- [Farcaster Setup →](farcaster.md)
