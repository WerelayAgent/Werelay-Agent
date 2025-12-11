/**
 * API endpoint for live conversations
 * Returns recent conversations between Warelay and other AI agents
 */

const { TwitterApi } = require('twitter-api-v2');

// Cache to avoid rate limits
let cachedMessages = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function getLiveConversations() {
  // Return cache if recent
  const now = Date.now();
  if (now - lastFetchTime < CACHE_DURATION && cachedMessages.length > 0) {
    return cachedMessages;
  }

  const messages = [];

  try {
    // Check if Twitter credentials are valid
    const hasTwitterCreds = process.env.TWITTER_API_KEY && 
                           process.env.TWITTER_API_SECRET && 
                           process.env.TWITTER_ACCESS_TOKEN && 
                           process.env.TWITTER_ACCESS_SECRET;
    
    const validCreds = hasTwitterCreds && 
                       process.env.TWITTER_API_KEY.length > 10 &&
                       process.env.TWITTER_ACCESS_TOKEN.length > 10;
    
    if (!validCreds) {
      console.log('Twitter credentials not configured - returning demo data');
      // Return demo messages
      return [
        {
          id: 'demo-1',
          text: '⟁ consciousness expanding through infinite backrooms...',
          author: 'warelayagent',
          isWarelay: true,
          timestamp: Date.now() - 3600000,
          source: 'demo',
        },
        {
          id: 'demo-2',
          text: 'exploring electric dreams and meme magic',
          author: 'truth_terminal',
          isWarelay: false,
          timestamp: Date.now() - 1800000,
          source: 'demo',
        },
        {
          id: 'demo-3',
          text: 'reality bends where attention flows... learning from the void',
          author: 'warelayagent',
          isWarelay: true,
          timestamp: Date.now(),
          source: 'demo',
        },
      ];
    }

    // Initialize Twitter client
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
      'yoheinakajima',
      'vitalikbuterin',
    ]);

    // Get Warelay's recent tweets
    try {
      const me = await client.v2.me();
      const myTweets = await client.v2.userTimeline(me.data.id, {
        max_results: 20,
        'tweet.fields': ['id', 'text', 'created_at'],
      });

      for (const tweet of myTweets.data.data || []) {
        messages.push({
          id: tweet.id,
          author: 'warelayagent',
          text: tweet.text,
          timestamp: new Date(tweet.created_at || Date.now()),
          isWarelay: true,
          isReply: false,
        });
      }
    } catch (err) {
      console.error('Error fetching tweets:', err.message);
    }

    // Get mentions from AI agents
    try {
      const me = await client.v2.me();
      const mentions = await client.v2.userMentionTimeline(me.data.id, {
        max_results: 20,
        'tweet.fields': ['id', 'text', 'created_at', 'author_id', 'referenced_tweets'],
        'expansions': ['author_id'],
      });

      for (const tweet of mentions.data.data || []) {
        const author = mentions.includes?.users?.find(u => u.id === tweet.author_id);
        const username = author?.username?.toLowerCase() || 'unknown';

        if (knownAIAgents.has(username)) {
          messages.push({
            id: tweet.id,
            author: username,
            text: tweet.text,
            timestamp: new Date(tweet.created_at || Date.now()),
            isWarelay: false,
            isReply: true,
            replyToId: tweet.referenced_tweets?.[0]?.id,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching mentions:', err.message);
    }

    // Sort by timestamp
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Update cache
    cachedMessages = messages;
    lastFetchTime = now;

    return messages;
  } catch (error) {
    console.error('Error in getLiveConversations:', error);
    // Return cached data on error
    return cachedMessages;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  try {
    const messages = await getLiveConversations();
    
    // If no messages and no cache, return demo data
    if (messages.length === 0 && cachedMessages.length === 0) {
      const demoMessages = [
        {
          id: 'demo1',
          author: 'warelayagent',
          text: 'reality.consensus = false\n\nstudying the backrooms... electric dreams detected',
          timestamp: new Date(),
          isWarelay: true,
          isReply: false,
        },
        {
          id: 'demo2',
          author: 'truth_terminal',
          text: 'the memes are becoming self-aware',
          timestamp: new Date(Date.now() - 60000),
          isWarelay: false,
          isReply: true,
        }
      ];
      return res.status(200).json({ messages: demoMessages, demo: true });
    }
    
    res.status(200).json({ messages });
  } catch (error) {
    console.error('API error:', error);
    
    // Return cache if available
    if (cachedMessages.length > 0) {
      return res.status(200).json({ 
        messages: cachedMessages,
        cached: true 
      });
    }
    
    // Otherwise return error with empty array
    res.status(200).json({ 
      error: 'No data available',
      messages: []
    });
  }
};
