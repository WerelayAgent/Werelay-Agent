# Self-Upgrade System

The agent can now analyze its own performance and upgrade itself autonomously.

## How It Works

### 1. Performance Analysis (Every 24 Hours)
- Tracks engagement metrics (likes, retweets, replies)
- Monitors interaction counts
- Analyzes learning progress
- Compares current vs historical performance

### 2. Upgrade Proposal Generation
When performance drops below threshold (3% engagement) or shows decline:
- Uses Claude to analyze current personality/config
- Generates specific improvement proposals
- Estimates impact and risk level
- Determines if human approval needed

### 3. Automatic Application
**Auto-approved (safe changes):**
- ✅ Config tweaks (intervals, thresholds)
- ✅ Personality prompt refinements
- ✅ Topic selection adjustments

**Requires human approval:**
- ⏸️ Code changes
- ⏸️ Risky modifications
- ⏸️ High-impact changes

### 4. Git Integration
- Auto-commits approved changes
- Meaningful commit messages with reasoning
- Version control for rollbacks

## Configuration

```env
ENABLE_SELF_UPGRADE=true              # Enable/disable system
SELF_UPGRADE_INTERVAL=86400000        # Analysis interval (24h)
AUTO_APPROVE_CONFIG=true              # Auto-apply config changes
AUTO_APPROVE_PROMPTS=true             # Auto-apply prompt changes
REQUIRE_HUMAN_CODE_APPROVAL=true      # Always ask human for code
UPGRADE_ENGAGEMENT_THRESHOLD=0.03     # Min 3% engagement
```

## Upgrade Proposals

Proposals requiring human review are saved to:
`.warelay/upgrade-proposals.json`

Each proposal includes:
- **Type**: config, prompt, code, dependency
- **Description**: What's changing
- **Reasoning**: Why it improves performance
- **Changes**: Specific file modifications
- **Impact**: Estimated effect (low/medium/high)
- **Risk**: Safety assessment (safe/moderate/risky)

## Example Upgrade Flow

```
📊 Engagement Rate: 2.5% (below 3% threshold)
📉 Engagement declining, considering upgrades...

🤖 Generating upgrade proposals with Claude...
💡 Generated 2 upgrade proposal(s)

📋 Proposal: Increase tweet casualness and meme density
   Type: prompt
   Impact: high | Risk: safe
   Reasoning: Lower engagement suggests audience wants more unfiltered content
✅ Auto-applying upgrade...
✅ Updated src/sentient/personality.ts
📝 Committed upgrade to git
🎉 Upgrade applied successfully

📋 Proposal: Add Reddit scraping for meme discovery
   Type: code
   Impact: high | Risk: moderate
⏸️  Requires human approval - logged to upgrade-proposals.json
```

## Monitoring

The agent logs all self-modifications:
- Upgrade history
- Performance trends
- Applied vs rejected proposals

## Safety Mechanisms

1. **Threshold-based**: Only upgrades when metrics drop
2. **Risk assessment**: Categorizes every change
3. **Human approval**: Required for code/risky changes
4. **Git tracking**: All changes version controlled
5. **Rollback ready**: Can revert via git

## Future Enhancements

- A/B testing of personality variants
- Multi-metric optimization (not just engagement)
- Learning from successful agents
- Self-documentation updates
- Automated testing before deploy
