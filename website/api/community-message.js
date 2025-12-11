/**
 * Community Message API
 * Allows website visitors to send messages to Warelay on Twitter
 */

const { TwitterApi } = require('twitter-api-v2');

// Rate limiting: store recent message timestamps per IP
const messageRateLimit = new Map();
const RATE_LIMIT_MINUTES = 5; // One message per 5 minutes per IP
const MAX_MESSAGE_LENGTH = 280;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ 
        success: false, 
        error: `Message too long (${message.length}/${MAX_MESSAGE_LENGTH})` 
      });
    }

    // Rate limiting by IP
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastMessageTime = messageRateLimit.get(clientIp);

    if (lastMessageTime && (now - lastMessageTime) < RATE_LIMIT_MINUTES * 60 * 1000) {
      const waitMinutes = Math.ceil((RATE_LIMIT_MINUTES * 60 * 1000 - (now - lastMessageTime)) / 60000);
      return res.status(429).json({ 
        success: false, 
        error: `Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before sending another message` 
      });
    }

    // Check Twitter API credentials
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET || 
        !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
      return res.status(503).json({ 
        success: false, 
        error: 'Twitter API not configured. Messages temporarily unavailable.' 
      });
    }

    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    // Format message with backrooms aesthetic
    const tweetText = `⟁ Message from the backrooms:\n\n"${message.trim()}"\n\n#BackroomsChat`;

    // Post tweet
    const tweet = await client.v2.tweet(tweetText);

    // Add to live conversations feed
    try {
      const allConversations = require('./all-conversations');
      if (allConversations.addCommunityMessage) {
        allConversations.addCommunityMessage(message.trim());
      }
    } catch (err) {
      // Ignore if all-conversations not available
    }

    // Update rate limit
    messageRateLimit.set(clientIp, now);

    // Clean up old rate limit entries (keep last hour only)
    for (const [ip, timestamp] of messageRateLimit.entries()) {
      if (now - timestamp > 60 * 60 * 1000) {
        messageRateLimit.delete(ip);
      }
    }

    return res.status(200).json({ 
      success: true, 
      tweetId: tweet.data.id,
      message: 'Message transmitted through the backrooms'
    });

  } catch (error) {
    console.error('Error sending community message:', error);
    
    // Check for Twitter API specific errors
    if (error.code === 429) {
      return res.status(429).json({ 
        success: false, 
        error: 'Twitter rate limit reached. Please try again later.' 
      });
    }

    if (error.code === 403) {
      return res.status(403).json({ 
        success: false, 
        error: 'Twitter API access restricted. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again.' 
    });
  }
};
