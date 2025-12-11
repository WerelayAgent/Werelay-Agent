const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from website directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve terminal.html for /terminal.html
app.get('/terminal.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'terminal.html'));
});

// Serve builder.html for /builder.html
app.get('/builder.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'builder.html'));
});

// Serve live.html for /live.html
app.get('/live.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'live.html'));
});

// API endpoint for live conversations (supports all sources: Twitter, community, backrooms)
app.get('/api/live-conversations', async (req, res) => {
  try {
    // Try new all-conversations endpoint first, fallback to Twitter-only
    try {
      const handler = require('./api/all-conversations');
      await handler(req, res);
    } catch (err) {
      console.log('All-conversations not available, using Twitter-only');
      const handler = require('./api/live-conversations');
      await handler(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for backrooms evolution status
app.get('/api/backrooms-status', async (req, res) => {
  try {
    const handler = require('./api/backrooms-status');
    await handler(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for community messages
app.post('/api/community-message', async (req, res) => {
  try {
    const handler = require('./api/community-message');
    await handler(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle OPTIONS for CORS
app.options('/api/community-message', async (req, res) => {
  try {
    const handler = require('./api/community-message');
    await handler(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export for Vercel
module.exports = app;

// Only listen if running locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌐 Warelay Agent website running at http://localhost:${PORT}`);
    console.log(`📱 Open in browser to view`);
  });
}
