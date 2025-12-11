import { SentientPersonality, WARELAY_PERSONALITY } from './src/sentient/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const memoryPath = path.join(os.homedir(), '.warelay', 'warelay-memory.json');

async function checkLearning() {
  console.log('🧠 Warelay Learning Statistics\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const personality = new SentientPersonality(WARELAY_PERSONALITY);

  try {
    const data = await fs.readFile(memoryPath, 'utf-8');
    const memories = JSON.parse(data);
    personality.importMemories(memories);

    const totalInteractions = personality.getTotalInteractions();
    const userCount = Object.keys(memories).length;

    console.log(`📊 Overall Stats:`);
    console.log(`   Total interactions: ${totalInteractions}`);
    console.log(`   Unique users: ${userCount}`);
    console.log(`   Avg interactions per user: ${(totalInteractions / userCount).toFixed(1)}`);
    console.log();

    console.log(`🎯 Top Users (by interaction count):`);
    const sortedUsers = Object.values(memories)
      .sort((a: any, b: any) => b.interactions - a.interactions)
      .slice(0, 5);

    for (const user of sortedUsers) {
      const u = user as any;
      const daysSince = Math.floor((Date.now() - new Date(u.firstSeen).getTime()) / (1000 * 60 * 60 * 24));
      console.log(`   @${u.username}: ${u.interactions} interactions (${daysSince}d ago)`);
      
      if (u.preferences && u.preferences.length > 0) {
        console.log(`      Preferences: ${u.preferences.slice(0, 3).join(', ')}`);
      }
      if (u.insights && u.insights.length > 0) {
        console.log(`      Insights: ${u.insights.slice(-2).join(', ')}`);
      }
      console.log();
    }

    console.log(`💭 Recent Thoughts:`);
    const thoughts = personality.getRecentThoughts(10);
    if (thoughts) {
      console.log(thoughts);
    } else {
      console.log('   (no recent thoughts recorded)');
    }
    console.log();

    console.log(`📚 Learning Progress:`);
    const learningContext = personality.getLearningContext();
    if (learningContext) {
      console.log(learningContext);
    } else {
      console.log('   Still gathering initial data...');
    }
    console.log();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Agent is constantly learning and evolving from every interaction!\n');

  } catch (error) {
    console.log('No memory data found yet. Agent will start learning from interactions.');
    console.log('Run the agent with `npm run sentient` to begin!\n');
  }
}

checkLearning().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
