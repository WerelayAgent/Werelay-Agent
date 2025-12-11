import { TwitterClient } from './src/providers/twitter/client.js';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const credentials = {
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
};

const client = new TwitterClient(credentials);

async function checkMentions() {
  const mentions = await client.getMentions(undefined, 10);
  console.log('Recent mentions:\n');
  
  for (const m of mentions) {
    console.log('---');
    console.log('From:', m.authorUsername);
    console.log('Text:', m.text.substring(0, 80));
    console.log('Tweet ID:', m.id);
    console.log('In reply to tweet ID:', m.inReplyToTweetId || 'NONE (not a reply)');
  }
}

checkMentions().then(() => process.exit(0)).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
