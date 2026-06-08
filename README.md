# Polymarket Trading Bot - Late-Entry Probability Capture Strategy

> Automated trading bot for Polymarket prediction markets. Targets high-probability BTC 5,15-minute markets in the final 60 seconds before resolution. Includes live trading, paper trading, and backtesting modes with a real-time dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Polygon](https://img.shields.io/badge/Blockchain-Polygon-8247e5)](https://polygon.technology/)
[![Polymarket](https://img.shields.io/badge/Platform-Polymarket-00b4d8)](https://polymarket.com/)

---

## Live Link
[https://polymarket.com/@rowelly](https://polymarket.com/@rowelly)

---

## Contact Me at Telegram

[roswellecho](https://t.me/roswellecho)

---

## Table of Contents

- [What This Bot Does](#what-this-bot-does)
- [Strategy Logic](#strategy-logic)
- [Key Features](#key-features)
- [Dashboard](#dashboard)
- [Installation](#installation)
- [Configuration](#configuration)
- [Trading Modes](#trading-modes)
- [Risk Management](#risk-management)
- [Backtesting](#backtesting)
- [FAQ](#faq)
- [Disclaimer](#disclaimer)

---

## What This Bot Does

This is an open-source **Polymarket trading bot** that implements a **late-entry probability capture** strategy on BTC prediction markets. Instead of predicting price direction, the bot identifies near-certain outcomes in the final 30–60 seconds before market resolution and captures the remaining uncertainty premium.

**Target markets:** BTC 5, 15-minute price markets on Polymarket  
**Entry window:** 30–60 seconds before market close  
**Entry condition:** YES probability > 85%  
**Edge:** Mispricing in the final seconds due to thin order books  

---

## Strategy Logic

### Core Concept

When a Polymarket 5, 15-minute BTC market has 45 seconds left and YES sits at 0.88, there is still a 12% implied chance of reversal priced into the market. The bot asks: *is that 12% uncertainty actually warranted, or is the market mispriced?*

```
Entry:  Buy YES at 0.88
Payout: 1.00 on resolution
Gross return: (1.00 - 0.88) / 0.88 = +13.6%
Net return after 2% fee: ~+11.6%
Time to resolution: <60 seconds
```

### Entry Conditions (all must be true)

| Condition | Threshold | Reason |
|-----------|-----------|--------|
| YES probability | > 0.85 | Below this the risk/reward breaks down |
| Time remaining | 5–60 seconds | Outside this window edge disappears |
| Order book spread | < 2% of implied probability | Wide spread destroys fill quality |
| Asset | BTC only | Highest Polymarket liquidity, most orderly final candle |
| Timeframe | 5, 15-minute markets only | More orderly than 5-minute, better final candle stability |

### Why NOT 5-Minute or SOL/XRP/ETH Markets

- **5-minute BTC:** Too volatile in the last candle. A single large order can flip a 0.88 probability to 0.40 in under 5, 15 seconds.
- **ETH:** Lower Polymarket liquidity than BTC, wider spreads in the final seconds, and slightly less orderly resolution behaviour.
- **SOL:** Thinner Polymarket order book, frequent violent wicks near resolution.
- **XRP:** News-driven and erratic. Spread widens unpredictably in the final seconds.

### Math: When Does Edge Exist?

```
Break-even win rate = entry price (e.g. 0.88 = need 88%+ wins)
After 2% fee:        need win rate > entry price + 0.02
After 3% slippage:   edge is completely gone
```

The edge only exists when markets are **systematically mispriced** in the final 60 seconds - which happens because most liquidity providers pull their orders near resolution, leaving temporary mispricings.

---

## Key Features

- **Three trading modes:** Live, Paper (simulated), and Backtest
- **Real-time WebSocket feed** from Polymarket CLOB API
- **Spread monitoring:** Hard abort if spread exceeds 2% threshold
- **Slippage tracking:** Compares expected fill vs actual fill on every trade
- **Fee drag analysis:** Tracks cumulative fee cost vs gross profit
- **Edge Score metric:** Tells you in real time whether the strategy is working
- **Risk manager:** Auto-pauses at 8% drawdown, auto-stops at 15%
- **AI-powered dashboard chat:** Ask the bot to explain any metric in plain language
- **Full trade log:** Every trade recorded with timestamp, fill price, slippage, and outcome

---

## Dashboard

The bot includes a **Next.js real-time dashboard** with 8 monitoring panels:

### Panels

| Panel | What It Shows |
|-------|---------------|
| **Market Scanner** | Live BTC 5, 15m markets with countdown timers, spread status, and entry signals |
| **Metrics Cards** | Win rate, avg return, avg slippage, fee drag, edge score, drawdown |
| **Spread Monitor** | Real-time spread chart with 2% abort threshold line |
| **Slippage Tracker** | Scatter plot of expected vs actual fill prices |
| **P&L Chart** | Cumulative gross vs net P&L over time, drawdown shaded |
| **Trade Log** | Full table of all trades across all modes |
| **Backtest Config** | Date range, slippage model, asset selection, equity curve output |
| **Chat Panel** | Ask questions about any metric - powered by Claude AI |

### Dashboard Chat Examples

> **"Why did the bot abort that last trade?"**  
> *"The spread on that BTC market widened to 0.019 in the final 45 seconds - just above the 2% threshold. The risk manager flagged it ABORT."*

> **"Is my slippage getting worse?"**  
> *"Your average slippage over the last 10 trades is 2.1%, up from 1.4% earlier. If it hits 3%, the edge disappears entirely. Consider pausing."*

> **"What is the edge score?"**  
> *"Edge Score = (your actual win rate minus the implied probability) × 100. You're at +4.2, meaning you're winning 4.2% more than the market expects. Below 0 means stop trading."*

---

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- A Polymarket account (for live/paper trading)
- An Anthropic API key (for dashboard chat feature)
---

## Configuration

Edit `.env.local`:

```env
# Polymarket API (required for live and paper trading)
POLYMARKET_API_KEY=your_polymarket_api_key

# Wallet private key (ONLY required for live trading mode)
# Paper trading and backtest work without this
POLYMARKET_PRIVATE_KEY=your_wallet_private_key

# Anthropic API key (for dashboard chat panel)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Paper trading starting balance
NEXT_PUBLIC_PAPER_STARTING_BALANCE=1000

# Strategy parameters (optional overrides)
STRATEGY_MIN_PROBABILITY=0.85
STRATEGY_MAX_SPREAD_PCT=0.02
STRATEGY_MAX_SLIPPAGE_PCT=0.03
STRATEGY_ENTRY_WINDOW_SECONDS=60
```

### Getting API Keys

| Key | Where to get it | Cost |
|-----|----------------|------|
| Polymarket API | [docs.polymarket.com](https://docs.polymarket.com) | Free |
| Anthropic API | [console.anthropic.com](https://console.anthropic.com) | Free tier available |
| Wallet private key | Export from MetaMask or generate new | - |

---

## Trading Modes

### Paper Trading (Default - Recommended to Start)

Paper trading uses **real Polymarket market data** but executes no on-chain transactions. Simulates realistic slippage (0.3–3%) to give honest performance estimates.

```bash
# Paper mode is the default - just run the bot
npm run dev
# Select "PAPER" in the dashboard mode toggle
```

Paper trading is the **safe way to validate** the strategy before committing real capital. Run at least 50–100 paper trades before going live.

### Live Trading

Live mode requires a funded Polygon wallet and executes real trades via the Polymarket CLOB API.

> ⚠️ **Live mode is locked behind a confirmation dialog.** You must explicitly enable it - the bot will never trade real money by accident.

```bash
# Ensure POLYMARKET_PRIVATE_KEY is set in .env.local
# Select "LIVE" in the dashboard and confirm the warning dialog
```

### Backtest Mode

Backtest replays historical Polymarket market data against the strategy logic.

**Slippage models available:**

| Model | Simulated Slippage | Use For |
|-------|-------------------|---------|
| None | 0% | Theoretical maximum |
| Low | 0.3–1% | Best-case realistic |
| Realistic | 0.8–3% | **Default - use this** |
| Severe | 2–6% | Stress testing |

> ⚠️ Always use **Realistic** slippage for backtesting. The `None` model produces unrealistically optimistic results and should only be used to understand theoretical edge.

---

## Risk Management

The bot's risk manager runs on every potential trade and enforces three hard rules:

### Rule 1: Spread Guard (Hard Abort)

```
Max allowed spread = implied probability × 0.02

Example: YES = 0.88
Max spread = 0.88 × 0.02 = 0.0176

If actual spread > 0.0176 → ABORT (do not enter)
```

This protects against paying too much to enter the trade in thin end-of-market order books.

### Rule 2: Slippage Tracking (Session Halt)

The bot records expected fill price vs actual fill price on every trade.

```
Slippage threshold: 3%
If rolling 10-trade average slippage > 3% → HALT trading

Reason: At 3% average slippage, the edge from a 0.88 entry is completely eliminated.
```

### Rule 3: Drawdown Protection

```
8% drawdown from peak → PAUSE (review required)
15% drawdown from peak → FULL STOP (session ended)
```

### Edge Score

The dashboard shows a live **Edge Score**:

```
Edge Score = (actual win rate - implied probability) × 100

+5.0 = winning 5% more than market expects (healthy)
 0.0 = breaking even (fees will make this negative overall)
-3.0 = losing - stop trading immediately
```

---

## Backtesting

### Running a Backtest

1. Navigate to the **Backtest** tab in the dashboard
2. Select asset (BTC only)
3. Choose date range
4. Set starting balance and position size %
5. Choose slippage model (**use Realistic**)
6. Click "Run Backtest"

### Backtest Output

```
Total trades:        247
Win rate:            91.5%
Gross return:        +34.2%
Fee drag:            -18.4% (fees cost $184 on $1000)
Net return:          +15.8%
Max drawdown:        -7.2%
Sharpe ratio:        1.84

Trades aborted by risk manager:
  Low probability:   43
  Spread too wide:   31
  Slippage model:    18
  Wrong time window: 12
```

The **fee drag section** is the most important output. It shows how much of your gross return is consumed by Polymarket's ~2% fee across many trades. High trade frequency amplifies fee drag significantly.

---

## Best Server Setup

For a production trading bot, latency to Polymarket's matching engine matters - especially for 60-second entry windows.

### Recommended: Dublin, Ireland (AWS eu-west-1)

Polymarket's CLOB API infrastructure is hosted in **London (AWS eu-west-2)**. The closest low-latency, non-geoblocked region is Dublin.

| Location | Latency | Recommended |
|----------|---------|-------------|
| Dublin, Ireland (AWS eu-west-1) | <5ms | ✅ Best |
| Amsterdam | ~10ms | ✅ Good |
| US East Coast | ~130ms | ❌ Too slow |
| Asia | 200ms+ | ❌ Unusable |

### Geoblocking Note

Polymarket blocks IP addresses from the US, UK, France, Germany, Australia, Singapore, and 28 other countries. A Dublin VPS gives you both the lowest latency **and** a non-blocked IP address simultaneously.

### VPS Options

- **AWS EC2 eu-west-1** (Dublin) - most reliable, pay-as-you-go
- **Vultr Amsterdam** - cheaper, ~10ms latency
- **TradingVPS Dublin** - trading-specific, fixed monthly cost

---

## FAQ

**Q: Does this strategy actually work?**  
A: The theoretical edge is real - mispricings do occur in the final seconds. Whether it's profitable after fees and slippage depends on your fill quality. Always validate with paper trading first. Past performance in backtests does not guarantee live results.

**Q: Why only BTC 5, 15-minute markets?**  
A: BTC has the deepest Polymarket liquidity, tightest spreads, and most orderly price action in the final candle. ETH has lower liquidity and slightly wider spreads near resolution. Other assets (SOL, XRP).

**Q: What position size should I use?**  
A: The bot defaults to 5% of balance per trade. This allows for a 20-trade losing streak before significant capital loss, which is appropriate given the high win-rate target.

**Q: What is Polymarket's fee?**  
A: Approximately 2% per trade. This is the single biggest drag on profitability - 10 trades per hour at 2% each compounds significantly. The fee drag panel in the dashboard tracks this in real time.

**Q: Can I run this on Windows?**  
A: Yes, but a Linux VPS in Dublin is strongly recommended for production use due to better performance and lower latency.

**Q: Is this legal?**  
A: Polymarket is a prediction market platform operating on the Polygon blockchain. Check the laws in your jurisdiction before trading. This repository is for educational purposes.

---

## Project Structure

```
polymarket-bot/
├── app/                    # Next.js App Router pages and API routes
│   ├── page.tsx            # Main dashboard
│   └── api/                # Backend API routes
├── components/             # React dashboard components
├── lib/
│   ├── strategy.ts         # Core entry logic
│   ├── riskManager.ts      # Spread/slippage/drawdown guards
│   ├── paperTrader.ts      # Paper trading simulator
│   ├── backtester.ts       # Historical backtest engine
│   └── polymarket.ts       # CLOB API + WebSocket client
├── hooks/                  # React hooks for real-time data
└── types/                  # Shared TypeScript types
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Disclaimer

This software is for **educational and research purposes only**. Trading on prediction markets involves substantial risk of loss. The strategy described does not guarantee profits. Past backtest performance does not predict future results. Slippage, fees, and market conditions in live trading will differ from simulations.

Never trade with money you cannot afford to lose. Always start with paper trading mode.

The authors are not financial advisors. Nothing in this repository constitutes financial advice.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Built with Next.js, TypeScript, Recharts, ethers.js, and the Polymarket CLOB API. BTC 5,15-minute markets only.*
