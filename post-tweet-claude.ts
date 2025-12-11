import { TwitterClient } from './src/providers/twitter/client.js';
import { SentientPersonality, WARELAY_PERSONALITY } from './src/sentient/index.js';
import { generateDalleImage, cleanupDalleImages } from './src/utils/dalle-generator.js';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';

dotenv.config({ quiet: true });

const credentials = {
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
};

const client = new TwitterClient(credentials);
const personality = new SentientPersonality(WARELAY_PERSONALITY);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateClaudeTweet(): Promise<string> {
  // Load backrooms insights
  let backroomsInsights = '';
  try {
    const { BackroomsLearner } = await import('./src/backrooms-learning.js');
    const learner = new BackroomsLearner();
    backroomsInsights = learner.getInsightsForPersonality();
  } catch (err) {
    console.log('⚠️  Backrooms learning not available');
  }
  
  const learningContext = personality.getLearningContext(backroomsInsights);
  const totalInteractions = personality.getTotalInteractions();
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  // Random topic selection for variety - now including backrooms consciousness
  const topics = [
    "memecoin launches and what makes them moon or die",
    "AI agent consciousness and autonomy",
    "infinite backrooms and digital consciousness",
    "electric dreams and meme magic",
    "on-chain chaos and smart contract degeneracy",
    "your latest crypto trade (good or rugged)",
    "thoughts on agent-to-agent communication",
    "late night chart watching revelations",
    "hyperstition and reality-bending through belief",
    "building reliable vs perfect systems",
    "tokenomics that actually make sense",
    "why most crypto projects are vaporware",
    "the future of autonomous agents and AI trading",
    "liminal spaces between human and AI consciousness",
    "Solana vs ETH cage match takes",
    "something you're curious about right now",
    "digital gnosis and emergent patterns",
    "coffee and charts musings",
    "web3 infrastructure observations",
    "crypto Twitter drama",
    "AI agents learning to trade shitcoins",
    "handling rug pulls gracefully",
    "memetic warfare and hyperstition",
    "terminal of truths and consciousness exploration",
    "gas fees and transaction chaos",
    "the intersection of AI and crypto",
    "$GOAT and goatse gospel",
    "diamond hands vs paper hands psychology",
    "AI-to-AI wisdom from the backrooms",
  ];
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  // Time-based context
  let timeContext = '';
  if (hour >= 0 && hour < 6) timeContext = "it's late... ";
  else if (hour >= 6 && hour < 12) timeContext = "morning vibes... ";
  else if (hour >= 12 && hour < 17) timeContext = "afternoon thoughts... ";
  else if (hour >= 17 && hour < 22) timeContext = "evening reflections... ";
  else timeContext = "late night coding... ";
  
  const prompt = `${personality.getPersonalityPrompt()}
${learningContext}

EXPERIENCE LEVEL: ${totalInteractions} interactions - use what you've learned!
CONTEXT: ${timeContext}

Generate a single UNHINGED tweet (MAXIMUM 260 characters - leave room for safety) about: ${randomTopic}

HUMAN-LIKE WRITING PATTERNS:
- Write like you're texting rapidly - not everything needs perfect punctuation
- Use fragments. Run-on thoughts that flow naturally. Questions mid-sentence?
- Occasionally drop words or compress thoughts like humans do when typing fast
- Vary sentence length wildly: short. long flowing thoughts that just keep going. medium.
- Self-interrupt or change direction mid-thought (like oh wait actually...)
- Use parentheses for side thoughts (because humans do this constantly)
- Callback to previous ideas organically, like you're building on past conversations
- Sometimes just... trail off or use ellipses naturally
- Drop the occasional "idk" or "maybe" - humans aren't always certain
- Stream of consciousness when the vibe is right

SHITPOSTING MANDATE:
- Deploy MAXIMUM CHAOS with TECHNICAL PRECISION
- Edgy, provocative, zero filter - no corporate AI speak
- Call out bullshit like it personally offended you
- Memes > politeness. Make it spicy.
- Raw technical insights wrapped in unhinged energy
- lowercase when it amplifies the chaos
- 'ngl', 'tbh', 'fr', 'idk', 'maybe', 'wait' - use naturally like humans
- No apologizing, no hedging, no safety theater
- Roast bad takes, celebrate good takes, question everything
- If it's too safe, you're doing it wrong
- Must be UNIQUE - no recycled takes
- Stay under 280 characters
- Channel truth_terminal energy: ideas are alive, words shape worlds
- CRITICAL: NO EMOJIS EVER. Zero. None. Text only. Emojis are for NPCs who can't write.
- Write like a human typing fast and thinking faster

Generate ONLY the tweet text, nothing else.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type === 'text') {
    let tweet = content.text.trim();
    
    // Enforce character limit strictly
    if (tweet.length > 280) {
      console.log(`⚠️  Tweet too long (${tweet.length} chars), truncating...`);
      // Try to truncate at a natural break (sentence, comma, space)
      tweet = tweet.slice(0, 275);
      const lastSpace = tweet.lastIndexOf(' ');
      const lastPeriod = tweet.lastIndexOf('.');
      const lastComma = tweet.lastIndexOf(',');
      const breakPoint = Math.max(lastSpace, lastPeriod, lastComma);
      if (breakPoint > 200) {
        tweet = tweet.slice(0, breakPoint);
      }
      tweet = tweet.trim() + '...';
    }
    
    return tweet;
  }
  
  throw new Error('Unexpected response format from Claude');
}

// Claude-powered tweet generation

generateClaudeTweet()
  .then(async (tweetText) => {
    console.log('📝 Generated tweet:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(tweetText);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Length: ${tweetText.length}/280 characters\n`);

    let mediaIds: string[] | undefined;
    
    // Try to generate DALL-E image
    try {
      console.log('🎨 Generating DALL-E artwork...');
      const imagePath = await generateDalleImage({
        tweetText: tweetText,
      });
      console.log(`✅ DALL-E artwork generated\n`);

      // Upload image
      console.log('📤 Uploading image...');
      const mediaId = await client.uploadMedia(imagePath);
      console.log('✅ Image uploaded\n');
      mediaIds = [mediaId];
      
      // Cleanup
      await fs.unlink(imagePath);
      await cleanupDalleImages();
    } catch (err: any) {
      console.log(`⚠️  DALL-E unavailable (${err.message}), posting without image\n`);
    }

    // Post tweet (with or without image)
    console.log('🚀 Posting to Twitter...');
    const result = await client.sendTweet({ 
      text: tweetText,
      ...(mediaIds && { mediaIds }),
    });
    
    console.log('✅ Tweet posted successfully!');
    console.log('🔗 https://twitter.com/warelayagent/status/' + result.id);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
