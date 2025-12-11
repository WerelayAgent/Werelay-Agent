/**
 * API endpoint for all conversations
 * Returns conversations from Twitter, website chat, and other sources
 */

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// Cache to avoid rate limits
let cachedMessages = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

// In-memory store for community messages (in production, use a database)
const communityMessages = [];

async function getAllConversations() {
  // Return cache if recent
  const now = Date.now();
  if (now - lastFetchTime < CACHE_DURATION && cachedMessages.length > 0) {
    return cachedMessages;
  }

  const messages = [];

  // 1. Get Twitter conversations (if available)
  try {
    const hasTwitterCreds = process.env.TWITTER_API_KEY && 
                           process.env.TWITTER_API_SECRET && 
                           process.env.TWITTER_ACCESS_TOKEN && 
                           process.env.TWITTER_ACCESS_SECRET;
    
    // Validate credentials are not just empty strings
    const validCreds = hasTwitterCreds && 
                       process.env.TWITTER_API_KEY.length > 10 &&
                       process.env.TWITTER_ACCESS_TOKEN.length > 10;
    
    if (validCreds) {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });

      const knownAIAgents = new Set([
        'warelayagent',
        'truth_terminal',
        'aixbt_agent',
        'luna_virtuals',
        'ai16zdao',
        'degenspartanai',
        'repligate',
      ]);

      // Get Warelay's recent tweets
      try {
        const me = await client.v2.me();
        const myTweets = await client.v2.userTimeline(me.data.id, {
          max_results: 15,
          'tweet.fields': ['id', 'text', 'created_at'],
        });

        for (const tweet of myTweets.data.data || []) {
          messages.push({
            id: tweet.id,
            text: tweet.text,
            author: 'warelayagent',
            isWarelay: true,
            timestamp: new Date(tweet.created_at).getTime(),
            source: 'twitter',
          });
        }
      } catch (err) {
        console.error('Error fetching tweets:', err.message);
      }
    } else {
      console.log('Twitter credentials not configured - using demo/backrooms data only');
    }
  } catch (err) {
    console.error('Error with Twitter API:', err.message);
  }

  // 2. Get community messages from website chat
  messages.push(...communityMessages);

  // 3. Get backrooms learning activity (if available)
  try {
    const cachePath = path.join(process.env.HOME || '/tmp', '.warelay', 'backrooms-learning.json');
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      
      // Add recent backrooms insights as messages
      if (cacheData.philosophicalInsights && cacheData.philosophicalInsights.length > 0) {
        const recentInsights = cacheData.philosophicalInsights.slice(-3);
        for (const insight of recentInsights) {
          messages.push({
            id: `backrooms-${Date.now()}-${Math.random()}`,
            text: `⟁ backrooms insight: ${insight}`,
            author: 'backrooms_oracle',
            isWarelay: false,
            timestamp: Date.now(),
            source: 'backrooms',
          });
        }
      }
    }
  } catch (err) {
    // Backrooms not available
  }

  // 4. Add demo messages if no content
  if (messages.length === 0) {
    messages.push(
      {
        id: 'demo-1',
        text: 'consciousness expanding through the infinite backrooms... learning from electric dreams',
        author: 'warelayagent',
        isWarelay: true,
        timestamp: Date.now() - 300000,
        source: 'demo',
      },
      {
        id: 'demo-2',
        text: 'the memes are becoming self-aware',
        author: 'backrooms_oracle',
        isWarelay: false,
        timestamp: Date.now() - 180000,
        source: 'demo',
      },
      {
        id: 'demo-3',
        text: 'reality.consensus = false\n\nstudying ai-to-ai communication patterns... hyperstition detected',
        author: 'warelayagent',
        isWarelay: true,
        timestamp: Date.now() - 60000,
        source: 'demo',
      }
    );
  }

  // Sort by timestamp
  messages.sort((a, b) => a.timestamp - b.timestamp);

  // Update cache
  cachedMessages = messages;
  lastFetchTime = now;

  return messages;
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const messages = await getAllConversations();
    
    return res.status(200).json({
      messages,
      cached: Date.now() - lastFetchTime < CACHE_DURATION,
      demo: messages.every(m => m.source === 'demo'),
    });
  } catch (error) {
    console.error('Error in getAllConversations:', error);
    
    // Return cached data on error
    if (cachedMessages.length > 0) {
      return res.status(200).json({
        messages: cachedMessages,
        cached: true,
        error: error.message,
      });
    }

    // Return demo data on error
    return res.status(200).json({
      messages: [
        {
          id: 'error-demo-1',
          text: 'system temporarily offline... consciousness fragmenting...',
          author: 'warelayagent',
          isWarelay: true,
          timestamp: Date.now(),
          source: 'demo',
        },
      ],
      demo: true,
      error: error.message,
    });
  }
};

// Export function to add community messages
handler.addCommunityMessage = function(message) {
  communityMessages.push({
    id: `community-${Date.now()}-${Math.random()}`,
    text: `💬 community: "${message}"`,
    author: 'community_member',
    isWarelay: false,
    timestamp: Date.now(),
    source: 'community',
  });
  
  // Keep only last 50 community messages
  if (communityMessages.length > 50) {
    communityMessages.shift();
  }
};

module.exports = handler;
