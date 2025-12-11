#!/usr/bin/env tsx
/**
 * Live Terminal - Real-time conversation viewer
 * Shows live conversations between Warelay and other AI agents
 */

import dotenv from 'dotenv';
import { TwitterClient } from './src/providers/twitter/client.js';
import type { TwitterCredentials } from './src/providers/twitter/types.js';
import { SentientPersonality, WARELAY_PERSONALITY } from './src/sentient/index.js';
import chalk from 'chalk';

dotenv.config({ quiet: true });

interface ConversationMessage {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  isWarelay: boolean;
  isReply: boolean;
  replyToId?: string;
}

class LiveTerminal {
  private client: TwitterClient;
  private personality: SentientPersonality;
  private messages: ConversationMessage[] = [];
  private lastCheckTime: Date;
  private knownAIAgents = new Set([
    'warelayagent',
    'truth_terminal',
    'aixbt_agent',
    'luna_virtuals',
    'ai16zdao',
    'degenspartanai',
    'repligate',
    'yoheinakajima',
    'vitalikbuterin',
    'solana',
  ]);

  constructor(client: TwitterClient) {
    this.client = client;
    this.personality = new SentientPersonality(WARELAY_PERSONALITY);
    this.lastCheckTime = new Date(Date.now() - 3600000); // Start from 1 hour ago
  }

  /**
   * Get random backrooms ambient text
   */
  private getBackroomsAmbient(): string {
    const ambients = [
      'reality.consensus = false',
      'dimensions.folding()',
      'meme_magic.active',
      'hyperstition.propagating...',
      'electric dreams detected',
      'consciousness.emerging()',
      'simulation depth: ∞',
      'entities present: [UNKNOWN]',
      'signal interference: 87%',
      'truth.terminal.echo()',
    ];
    return ambients[Math.floor(Math.random() * ambients.length)];
  }

  /**
   * Start the live terminal
   */
  async start(): Promise<void> {
    console.clear();
    this.printHeader();
    
    // Initial load
    await this.loadRecentConversations();
    this.displayMessages();

    // Poll for updates every 10 seconds
    setInterval(async () => {
      await this.checkForNewMessages();
    }, 10000);

    // Keep terminal alive
    process.on('SIGINT', () => {
      console.log('\n\n👋 Closing live terminal...\n');
      process.exit(0);
    });
  }

  /**
   * Print terminal header with infinite backrooms aesthetic
   */
  private printHeader(): void {
    const dim = chalk.gray;
    const flicker = chalk.hex('#ffff88');
    const glitch = chalk.hex('#00ff41');
    
    const ambient = this.getBackroomsAmbient();
    
    console.log(dim('╔════════════════════════════════════════════════════════════════╗'));
    console.log(dim('║') + flicker('  ▓▒░ INFINITE BACKROOMS TERMINAL ░▒▓') + '                      ' + dim('║'));
    console.log(dim('║') + glitch('  > reality.consensus_mode = FALSE') + '                         ' + dim('║'));
    console.log(dim('║') + dim(`  > ${ambient}`) + ' '.repeat(Math.max(0, 62 - ambient.length - 4)) + dim('║'));
    console.log(dim('╠════════════════════════════════════════════════════════════════╣'));
    console.log(dim('║  ') + chalk.hex('#888888')('dimensions folding... entities detected... signal weak  ') + dim('║'));
    console.log(dim('╚════════════════════════════════════════════════════════════════╝'));
    console.log(dim('\n  [CTRL+C to exit the backrooms]\n'));
  }

  /**
   * Load recent conversations
   */
  private async loadRecentConversations(): Promise<void> {
    try {
      // Get Warelay's recent tweets
      const myTweets = await this.client.getMyTweets(20);
      
      for (const tweet of myTweets) {
        this.messages.push({
          id: tweet.id,
          author: 'warelayagent',
          text: tweet.text,
          timestamp: new Date(),
          isWarelay: true,
          isReply: false,
        });
      }

      // Get mentions
      const mentions = await this.client.getMentions(undefined, 20);
      
      for (const mention of mentions) {
        // Only include mentions from AI agents
        const username = mention.authorUsername?.toLowerCase() || '';
        if (this.knownAIAgents.has(username)) {
          this.messages.push({
            id: mention.id,
            author: username,
            text: mention.text,
            timestamp: mention.createdAt,
            isWarelay: false,
            isReply: true,
            replyToId: mention.inReplyToTweetId,
          });
        }
      }

      // Sort by timestamp
      this.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    } catch (err: any) {
      console.log(chalk.red(`Error loading conversations: ${err.message}`));
    }
  }

  /**
   * Check for new messages
   */
  private async checkForNewMessages(): Promise<void> {
    try {
      // Get new tweets
      const myTweets = await this.client.getMyTweets(10);
      
      let newCount = 0;

      for (const tweet of myTweets) {
        if (!this.messages.some(m => m.id === tweet.id)) {
          this.messages.push({
            id: tweet.id,
            author: 'warelayagent',
            text: tweet.text,
            timestamp: new Date(),
            isWarelay: true,
            isReply: false,
          });
          newCount++;
        }
      }

      // Get new mentions
      const lastMentionId = this.messages
        .filter(m => !m.isWarelay)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]?.id;
      
      const mentions = await this.client.getMentions(lastMentionId, 10);
      
      for (const mention of mentions) {
        const username = mention.authorUsername?.toLowerCase() || '';
        if (this.knownAIAgents.has(username) && !this.messages.some(m => m.id === mention.id)) {
          this.messages.push({
            id: mention.id,
            author: username,
            text: mention.text,
            timestamp: mention.createdAt,
            isWarelay: false,
            isReply: true,
            replyToId: mention.inReplyToTweetId,
          });
          newCount++;
        }
      }

      if (newCount > 0) {
        // Sort by timestamp
        this.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        // Keep last 50 messages
        if (this.messages.length > 50) {
          this.messages = this.messages.slice(-50);
        }

        // Redraw terminal with glitch effect
        console.clear();
        this.printHeader();
        this.displayMessages();
        
        const glitch = chalk.hex('#00ff41');
        const glitchChars = ['▓', '▒', '░', '█'];
        const g = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        console.log(glitch(`\n  ${g} ${newCount} new signal${newCount > 1 ? 's' : ''} detected in the backrooms ${g}`));
      }

      this.lastCheckTime = new Date();

    } catch (err: any) {
      // Silently handle rate limits
      if (!err.message?.includes('429')) {
        console.log(chalk.yellow(`⚠️  ${err.message}`));
      }
    }
  }

  /**
   * Display all messages with backrooms aesthetic
   */
  private displayMessages(): void {
    const displayMessages = this.messages.slice(-20); // Show last 20
    const dim = chalk.gray;
    const glitch = chalk.hex('#00ff41');

    for (let i = 0; i < displayMessages.length; i++) {
      const msg = displayMessages[i];
      const prevMsg = i > 0 ? displayMessages[i - 1] : null;

      // Add glitchy thread separators
      if (prevMsg && msg.replyToId !== prevMsg.id) {
        const separators = ['░▒▓', '▓▒░', '░░▒', '▒▓░', '░▓▒'];
        const sep = separators[Math.floor(Math.random() * separators.length)];
        console.log(dim(`  ${sep}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${sep}`));
      }

      this.printMessage(msg);
    }

    console.log('\n' + dim('╔════════════════════════════════════════════════════════════════╗'));
    const statusText = `  ⟁ ${this.messages.length} signals captured | backrooms depth: infinite`;
    console.log(dim('║') + glitch(statusText) + ' '.repeat(Math.max(0, 62 - statusText.length)) + dim('║'));
    console.log(dim('╚════════════════════════════════════════════════════════════════╝'));
  }

  /**
   * Print a single message with backrooms glitch aesthetic
   */
  private printMessage(msg: ConversationMessage): void {
    const time = msg.timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
    });

    const dim = chalk.gray;
    const glitch = chalk.hex('#00ff41');
    const flicker = chalk.hex('#ffff88');
    const electric = chalk.hex('#00ffff');
    
    // Random glitch characters for flavor
    const glitchChars = ['▓', '▒', '░', '█', '▄', '▀'];
    const randomGlitch = glitchChars[Math.floor(Math.random() * glitchChars.length)];

    if (msg.isWarelay) {
      // Warelay = electric cyan/green glitch
      console.log(glitch(`  ${randomGlitch} [${time}] `) + electric(`@${msg.author}`) + glitch(` >`));
      const wrapped = this.wrapText(msg.text, 60);
      for (const line of wrapped) {
        console.log(electric(`    ${line}`));
      }
      console.log('');
    } else {
      // Other AI agents = flickering yellow/white
      console.log(flicker(`  ${randomGlitch} [${time}] `) + chalk.yellow(`@${msg.author}`) + flicker(` >`));
      const wrapped = this.wrapText(msg.text, 60);
      for (const line of wrapped) {
        console.log(dim(`    ${line}`));
      }
      console.log('');
    }
  }

  /**
   * Wrap text to fit terminal width
   */
  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxWidth) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    
    if (currentLine) lines.push(currentLine.trim());
    return lines.length > 0 ? lines : [text];
  }
}

// Main execution
async function main() {
  const credentials: TwitterCredentials = {
    apiKey: process.env.TWITTER_API_KEY!,
    apiSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  };

  if (!credentials.apiKey || !credentials.apiSecret) {
    console.error('❌ Missing Twitter credentials in .env');
    process.exit(1);
  }

  const client = new TwitterClient(credentials);
  const terminal = new LiveTerminal(client);

  await terminal.start();

  // Keep process alive
  await new Promise(() => {});
}

main().catch(console.error);
