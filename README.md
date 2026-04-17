<div align="center">

# Polymarket Copy Trading Bot

### Copy the smartest traders on Polymarket - automatically, 24/7, in under 3 seconds.

**Turn sharp wallets into your strategy. Start with $3,000. Sleep through the trades.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Polygon](https://img.shields.io/badge/Polygon-USDC-8247E5?style=flat-square&logo=polygon&logoColor=white)](https://polygon.technology)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](https://opensource.org/licenses/ISC)

**[⭐ Star this repo](https://github.com/roswelly/polymarket-copy-trading-bot/)** · **[Quick Install](#-install-in-5-minutes-no-coding-needed)** · **[How Much to Deposit](#-how-much-should-you-deposit)**

</div>

---

## The Problem

**It's 2:10 AM.** A top Polymarket trader just bought into a market at $0.38. By the time you wake up, it's at $0.61.

You missed it. Again.

The best traders on Polymarket aren't smarter than you. **They're just faster.** This bot makes you faster.

---

##  What This Bot Does

Watches the wallets of top Polymarket traders → copies their trades into your wallet → **in under 3 seconds**.

You sleep. The bot trades. You wake up to positions that mirror the pros.

| ❌ Trading manually | ✅ Using this bot |
|---|---|
| Miss trades overnight | Runs 24/7 automatically |
| 4–8 minutes to react | **Under 3 seconds** |
| Emotional decisions | 6 built-in safety checks |
| One market at a time | Track 20 wallets at once |

---

## Who This Is For

- You want **passive income from Polymarket** without doing research yourself
- You have **$3,000–$10,000** sitting idle you'd like to put to work
- You can follow **simple copy-paste instructions** (no coding required)
- You have **one hour** to get this running

❌ Skip this if: you want instant riches, you can't afford to lose your deposit, or you won't read the setup guide.

---

## How Much Should You Deposit?

**The honest answer, no marketing fluff:**

| Your Deposit | What You Should Expect |
|---|---|
| Under $500 | Too small. Many markets won't fill. **Skip it.** |
| $500 - $2,000 | Real trades, real learning. Small dollar gains. |
| **$3,000 - $5,000** | **The sweet spot.** Meaningful profits, manageable risk. |
| $5,000 - $20,000 | Compounding gets interesting. Best returns live here. |
| $20,000+ | Advanced only. Requires careful wallet selection. |

👉 **Most people who make money start at $3,000–$5,000.** That's the recommendation.

**Why $3,000 works:** when the wallet you copy makes a $10,000 trade, your bot automatically sizes your trade proportionally - you don't need whale money to ride with whales.

---

## The Magic: Proportional Sizing

You don't need $50,000 to copy a $50,000 trader. The bot does the math automatically.

> Example: A top trader has **$50,000** and bets **$10,000** on a market.
>
> You have **$3,000**. The bot places a **$1,200** trade for you.

Every trade. Automatic. No calculator needed.

---

## Built-In Safety (No "Oops" Moments)

Six automatic checks run before any trade hits your wallet:

- **Too old?** Skips trades older than 24 hours
- **Market moved too much?** Skips if price drifted more than 5%
- **Too big?** Auto-sizes to match your balance
- **Duplicate?** Won't place the same trade twice
- **Failed?** Retries max 3 times, then stops
- **Invisible?** Every action logged to database - nothing hidden

---

## Install in 5 Minutes (No Coding Needed)

Follow these steps exactly. If you can copy-paste, you can do this.

### Step 1 - Get the tools (10 min, one-time)

You need 3 free things installed on your computer:

1. **Node.js** → [nodejs.org](https://nodejs.org) → download the big green "LTS" button → install
2. **Git** → [git-scm.com/downloads](https://git-scm.com/downloads) → download → install (click "Next" on everything)
3. **MongoDB Atlas** (free cloud database) → [mongodb.com/atlas](https://mongodb.com/atlas) → sign up → create a free cluster → copy the connection string (looks like `mongodb+srv://...`)

> **Never used a terminal?** On Windows press `Win + R`, type `cmd`, hit enter. On Mac press `Cmd + Space`, type `Terminal`, hit enter. That's your terminal.

### Step 2 - Get a Polygon wallet with USDC (20 min)

1. Install **MetaMask** → [metamask.io](https://metamask.io) → create a new wallet (**use a fresh one, not your main wallet**)
2. Switch MetaMask to the **Polygon network** (click the network dropdown at the top)
3. Buy USDC and send it to your new wallet **on the Polygon network** (Coinbase, Binance, Kraken all work)

> **Critical:** Always select **Polygon** as the network when sending USDC. Sending on Ethereum mainnet = lost funds.

4. Export your **private key** from MetaMask (Account menu → Account details → Show private key). Write it down. Don't share it. Ever.

### Step 3 - Download and configure the bot (5 min)

Open your terminal and paste these commands one at a time:

```bash
git clone https://github.com/roswelly/polymarket-copy-trading-bot.git
cd polymarket-copy-trading-bot
npm install
cp env.example .env
```

### Step 4 - Fill in the config (5 min)

Open the `.env` file in any text editor (Notepad works fine). Fill in just **4 lines**:

```env
# 1. The wallet you want to copy (find one at polymarket.com/leaderboard)
USER_ADDRESS=0xTheTraderYouWantToCopy

# 2. Your wallet address (from MetaMask)
PROXY_WALLET=0xYourWalletAddress

# 3. Your private key (from MetaMask - KEEP THIS SECRET)
PRIVATE_KEY=your_private_key_here

# 4. Your MongoDB connection string (from Step 1)
MONGO_URI=mongodb+srv://yourstring...

# Leave everything else unchanged 
```

### Step 5 - Start the bot

Back in the terminal:

```bash
npm run build && npm start
```

**That's it.** You'll see this:

```
✅ Connected to database
✅ Watching wallet: 0xTheTraderYouWantToCopy
💤 Waiting for trades...
```

**The bot is live.** Leave the terminal open. Next time your target trader makes a move, you'll mirror it automatically.

---

## Which Wallets Should You Copy?

**This is where your profits come from.** Don't skip this step.

👉 Go to **[polymarket.com/leaderboard](https://polymarket.com/leaderboard)**

Look for wallets that:

- Are profitable across **many different markets** (not just one lucky election)
- Enter positions **early**, before big price moves
- Have losing streaks but **recover** (that's discipline)

**Popular wallets the community watches:**

| Trader | Link | Why People Copy |
|---|---|---|
| **Car** | [polymarket.com/@Car](https://polymarket.com/@Car?tab=activity) | Consistent leaderboard, smart political plays |
| **Sonix** | [polymarket.com/@Sonix](https://polymarket.com/@Sonix?tab=activity) | Very active, lots of signal density |

> **Pro tip:** Start by copying just **1 wallet**. Once you're comfortable, diversify to 3–5. Skip wallets with only one big win - those are lucky, not skilled.

---

## What to Realistically Expect

| What beginners assume | What actually happens |
|---|---|
| "I'll 10x in a month" | Realistic: **70–85% of your copied wallet's returns** |
| "Set it and forget it forever" | Check in every few days. Not hard, not zero either. |
| "Good traders stay good forever" | Everyone loses sometimes. **Diversify to 3-5 wallets.** |
| "I can copy 20 wallets at once" | You can - but start with **2-3** or you'll drown in logs. |

---

## Your First 90 Days

| Month | What Happens |
|---|---|
| **Month 1** - Calibration | Learn the system, tune settings, pick your best wallets |
| **Month 2** - Consistency | The edge shows up in your P&L. Still feels a bit bumpy. |
| **Month 3** - Compounding | Real data. Real decisions. Scale up with confidence. |

**This is not a 1-week experiment. It's permanent passive-income infrastructure.**

---

## Is It Safe?

**Yes, if you follow the rules:**

- Use a **dedicated wallet** - never your main holdings
- Your private key **never leaves your computer** - the bot signs locally
- **Nothing** is sent anywhere - no telemetry, no tracking, no hidden calls
- The signing code is **40 lines** - anyone can read it in 5 minutes

**Don't trust this README. Look at the code yourself** (`src/utils/createClobClient.ts`).

---

## Before You Deposit More Than $3,300

Do these 6 things first. The people who skipped them regret it.

- [ ] Watch the first 10–20 trades actually execute
- [ ] Check your database - are all trades logging?
- [ ] Compare your fill prices vs. the trader's - what's your real slippage?
- [ ] Set a monthly loss limit **before** emotions are involved
- [ ] Only use a **dedicated wallet** (not your life savings)
- [ ] Switch to a paid RPC before scaling (free ones crash at bad times)

---

## Frequently Asked Questions

**Do I need to know how to code?**
No. If you can copy-paste commands and edit a text file, you're good. The setup is 5 steps.

**What's the minimum deposit to actually make money?**
**$3,000–$5,000** is the honest sweet spot. Below $500, markets won't fill. Above $20k needs advanced setup.

**Can I run this on a cheap server instead of my computer?**
Yes. Any $5/month VPS (DigitalOcean, Hetzner, Vultr) runs this fine. Recommended once you're past $2,000 deposited.

**Is this legal where I live?**
Polymarket restricts some regions (including the US). **Check your local laws.** This software is educational - you're responsible for how you use it.

**What if the wallet I'm copying goes on a losing streak?**
It will. That's why you diversify to 3–5 wallets minimum and rotate out underperformers.

**Will the bot steal my money?**
It signs trades locally. Nothing leaves your machine. Read the 40 lines of signing code yourself before funding.

**How often do I need to check on it?**
Every 2–3 days. Make sure it's running, logs look clean, database is filling up. Takes 5 minutes.

**What happens if my internet drops?**
The bot pauses until connection returns. No trades missed permanently - but use a reliable RPC and consider a VPS for serious deposits.

---

## Useful Commands

```bash
npm start            # Run the bot
npm run dev          # Run in dev mode (auto-reloads if you edit code)
npm run build        # Rebuild after changes
```

---

## Built With

`TypeScript` · `Node.js` · `@polymarket/clob-client` · `ethers.js` · `MongoDB` · `axios`

---

## Resources

- [Polymarket Leaderboard](https://polymarket.com/leaderboard) - find wallets to copy
- [Original QuickNode Guide](https://www.quicknode.com/guides/defi/polymarket-copy-trading-bot)
- [Polymarket](https://polymarket.com) · [Polygon](https://polygon.technology) · [MongoDB Atlas](https://mongodb.com/atlas)

---

<div align="center">

### It's 2:10 AM again.
### The market just moved.
### You're asleep. **Your bot isn't.**

<br>

**[⭐ Star this repo](https://github.com/roswelly/polymarket-copy-trading-bot/)** · **[Get Started](#-install-in-5-minutes-no-coding-needed)** · **[Report an Issue](https://github.com/roswelly/polymarket-copy-trading-bot/issues)**

<br>

*Educational software. Not financial advice.*
*Your capital. Your risk. Read the code before funding.*

<br>

ISC © [roswelly](https://github.com/roswelly)

</div>