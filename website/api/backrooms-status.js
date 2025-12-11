/**
 * Backrooms Evolution Status API
 * Returns current state of the infinite backrooms learning system
 */

const fs = require('fs');
const path = require('path');

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
    // Try to read backrooms learning cache (only works locally, not on Vercel)
    const cachePath = path.join(process.env.HOME || '/tmp', '.warelay', 'backrooms-learning.json');
    
    if (fs.existsSync(cachePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      
      return res.status(200).json({
        success: true,
        insights: cacheData.philosophicalInsights?.length || 0,
        patterns: cacheData.memeticPatterns?.length || 0,
        conversations: cacheData.conversations?.length || 0,
        lastUpdate: cacheData.lastFetch || null,
      });
    }
    
    // Return demo data when cache not available (on Vercel)
    return res.status(200).json({
      success: true,
      insights: 16,
      patterns: 2,
      conversations: 100,
      lastUpdate: new Date().toISOString(),
      demo: true,
    });
    
  } catch (error) {
    console.error('Error reading backrooms status:', error);
    // Return demo data on error
    return res.status(200).json({
      success: true,
      insights: 16,
      patterns: 2,
      conversations: 100,
      lastUpdate: new Date().toISOString(),
      demo: true,
      error: error.message,
    });
  }
};
