# Polymarket Copy Trading Bot

A TypeScript service that mirrors trades from selected Polymarket wallets into your own wallet, in near real time, with configurable position sizing and safety filters.

Built on `@polymarket/clob-client`, `ethers.js`, and MongoDB. Runs on Polygon with USDC.

---

## What it does

The bot watches one or more Polymarket trader wallets via the Data API, detects new fills, and places proportionally-sized orders from your wallet through the CLOB. Every observed trade and every action taken is logged to MongoDB so you can audit behavior and measure performance against the source wallet.

**Typical end-to-end latency from source fill to your order submission is 2–4 seconds**, depending on RPC and network conditions. This is not a latency-critical system — Polymarket markets move on the scale of minutes to hours, not milliseconds.

---

## How it works

```
Source wallet fills a trade on Polymarket
        │
        ▼
Polling loop detects the new fill via Data API
        │
        ▼
Safety filters evaluate the trade (age, slippage, size, duplicates)
        │
        ▼
Position sizing: your order is scaled to (your_balance / source_balance)
        │
        ▼
CLOB client signs and submits the order from your wallet
        │
        ▼
Result logged to MongoDB (success, failure, or skip with reason)
```

The copy scale is proportional to balances. If the source wallet holds $50,000 and places a $10,000 position (20% of their capital), and your wallet holds $3,000, the bot submits a $600 position (20% of your capital). You can override the scale in the config.

---

## Who should use this

This project is useful if you:

- Already understand Polymarket and prediction-market mechanics
- Want to automate mirroring of wallets you've personally vetted
- Are comfortable running a Node.js service, editing config files, and reading logs
- Can tolerate losses — copy trading inherits the source wallet's risk, including its losses

This project is **not** appropriate if you:

- Expect guaranteed returns (there are none, and anyone promising them is lying)
- Can't afford to lose the capital you deposit
- Aren't willing to read the signing code before funding the wallet
- Live in a jurisdiction where Polymarket is restricted (the US among others — check your local law)

---

## Safety filters

Six filters run before any order is submitted. All are configurable in `.env`:

| Filter | Purpose | Default |
|---|---|---|
| Trade age | Skip trades older than N seconds when detected | 24 hours |
| Price drift | Skip if market price has moved more than X% from the source's fill price | 5% |
| Balance cap | Cap order size at a fraction of your wallet balance | configurable |
| Duplicate detection | Compare against recent order history in MongoDB to prevent replays | enabled |
| Retry limit | Retry a failed submission up to N times, then stop and log | 3 |
| Full audit trail | Every evaluation, skip, and submission written to MongoDB | always on |

These filters do not guarantee profitability. They reduce operator-error failure modes (stale fills, price gapping, accidental double-submission). The strategy risk — the risk that the wallet you're copying makes bad trades — is not hedged by any of this.

---

## Position sizing, honestly

Proportional sizing solves one problem: you can follow a large trader without having their capital. It does not solve the harder problems:

- **Slippage is worse at your scale than theirs on thin markets.** A $600 order in a $5,000-liquidity market eats a larger share of the book than the source's $10,000 order did in a $100,000 market they were trading. Your fill price will usually be worse.
- **Entry timing matters.** You're always arriving 2–4 seconds after the source. For markets that move fast on news, that gap costs you price.
- **You can't copy exits perfectly.** If the source wallet exits during downtime, your position is still open. Run the bot on a reliable host if you scale up capital.

Expect your realized return to be **lower than the source wallet's return**, not equal to it. A reasonable working assumption is 70–85% of the source's return on comparable time horizons, with higher variance on small positions.

---

## Deposit sizing guidance

There is no "right" amount. This is a rough framing of what the tradeoffs look like:

- **Under $500.** Many orders won't fill because your proportional size is below the market's minimum tick × liquidity threshold. Not recommended unless you're testing.
- **$500 – $2,000.** Usable for testing the full pipeline against real execution. Dollar gains and losses will be small. Good for calibrating before scaling.
- **$3,000 – $10,000.** Enough capital for orders to fill reliably on most active markets. Still small enough that a single bad wallet choice won't ruin you.
- **$10,000+.** Requires more attention to wallet selection, slippage monitoring, and infrastructure (paid RPC, VPS, monitoring). Not a set-and-forget range.

None of these are recommendations. They're observations about how market minimums and fill probability scale with position size. Start smaller than you think you should.

---

## Installation

Prerequisites: Node.js 18+, Git, MongoDB (Atlas free tier works), a Polygon wallet with USDC.

```bash
git clone https://github.com/roswelly/polymarket-copy-trading-bot.git
cd polymarket-copy-trading-bot
npm install
cp env.example .env
```

Fill in `.env`:

```env
USER_ADDRESS=0x...          # wallet to copy (from polymarket.com/leaderboard)
PROXY_WALLET=0x...          # your Polygon wallet address
PRIVATE_KEY=...             # your wallet's private key — do not share, do not commit
MONGO_URI=mongodb+srv://... # your MongoDB connection string
```

Other variables in `env.example` control the filter thresholds and polling interval — defaults are reasonable for initial testing.

Run:

```bash
npm run build && npm start
```

You should see:

```
Connected to MongoDB
Watching wallet: 0x...
Polling for new fills...
```

Leave the process running. For anything beyond initial testing, run it on a VPS or persistent host — closing your laptop stops the bot.

---

## Wallet selection

This is the variable that determines outcomes, not the bot itself. The bot is a transport mechanism; the wallet you copy is the strategy.

Use [polymarket.com/leaderboard](https://polymarket.com/leaderboard) and filter for wallets that show:

- Consistent profit across many uncorrelated markets, not one windfall
- A track record spanning at least several months
- Reasonable position sizing relative to their bankroll (not 80% on single bets)
- Recovery from drawdowns without blowing up

A wallet that went +$200k on one election is not necessarily skilled. A wallet that is +30% over 200 trades across different categories probably is.

Common starting point: copy one wallet for the first few weeks, watch the logs, verify that fills look sane, then diversify to 3–5 wallets to reduce single-wallet risk. Copying 10+ wallets simultaneously produces more noise than signal at small deposit sizes.

---

## Operational guidance

A few things that matter once the bot is live:

**Use a paid RPC.** Free public Polygon RPCs rate-limit and drop requests under load. Alchemy, QuickNode, and Infura paid tiers are all fine. A dropped poll means a missed trade.

**Monitor the logs, at least weekly.** You want to see fill rate (what percentage of detected source trades resulted in a successful mirror), average slippage versus the source's fill price, and the skip breakdown by filter. MongoDB aggregation queries against the logs collection will give you this.

**Set a drawdown stop.** Decide before you deposit how much loss would cause you to turn the bot off. Without that, you'll rationalize through a losing month.

**Rotate wallets.** Good traders go cold. Review your copied wallets monthly against their recent performance on the Polymarket leaderboard and drop ones that have underperformed for two-plus months.

**Use a dedicated wallet.** Never point the bot at a wallet holding funds you can't afford to put at risk. The private key sits in `.env` on whatever machine you're running on.

---

## Security notes

The bot signs transactions locally. Your private key stays in `.env` and is loaded into the signing client via `ethers.js`. Review `src/utils/createClobClient.ts` — the signing path is short and self-contained.

That said:

- `.env` is a plaintext file on your host. If your machine is compromised, so is the key. Consider disk encryption and standard host hardening if you're running meaningful capital.
- There is no built-in spend cap at the signing layer. If the trade-execution code has a bug that sizes an order incorrectly, the signer will sign it. Keep deposits proportional to your trust in the code you've reviewed.
- Exported MongoDB logs contain your wallet address and trading history. Treat them as sensitive.

This project has not been audited. Read the code before funding.

---

## What to expect in the first few months

**First few weeks.** Tuning phase. You're verifying that detections fire, orders submit, fills land at acceptable slippage, and the filter thresholds make sense for the wallets you're copying. Expect to adjust `.env` values a few times.

**One to three months.** The noise-to-signal ratio on returns is high in this range. Don't draw conclusions from a two-week window — prediction markets resolve on their own timeline, and unresolved positions look like losses in your logs until they settle.

**Three months and beyond.** Enough realized P&L to evaluate whether your wallet selection is working. This is the point to decide whether to scale capital up, change your copied wallets, or stop.

If the realized returns after three months of reasonable operation are materially negative versus the source wallets, the issue is usually one of: RPC reliability (missed trades), slippage (thin markets at your size), or wallet selection (the source wasn't as good as the leaderboard suggested). The bot itself is rarely the limiting factor.

---

## FAQ

**Do I need to know how to code?**
You need to be comfortable editing a config file, running shell commands, and reading log output. You don't need to write code, but you should be able to read the 40 lines of signing logic before you fund the wallet.

**Can I run this on a VPS?**
Yes — any $5/month VPS (DigitalOcean, Hetzner, Vultr) is sufficient. Recommended once you're depositing more than a trivial amount, so that the bot continues running when your laptop is closed.

**What happens if my internet drops?**
The bot pauses until the connection returns. You will miss trades that occurred during the outage; there is no backfill. This is a good reason to run on a VPS with reliable networking.

**Is this legal?**
Polymarket restricts access from several jurisdictions, including the United States. Running this software to place trades from a restricted jurisdiction may violate Polymarket's terms of service and/or local law. This is your responsibility to understand before using the bot.

**What if the wallet I'm copying starts losing?**
It happens to every trader eventually. This is the case for diversifying across several wallets and reviewing performance monthly. No filter in this bot will save you from consistently choosing bad wallets to copy.

**Does the bot send data anywhere?**
No external telemetry. All network calls are to the Polygon RPC, the Polymarket API, and your MongoDB instance. You can verify this by reading the code or running it behind a network monitor.

---

## Commands

```bash
npm start        # run the bot
npm run dev      # run with auto-reload on file changes
npm run build    # rebuild after editing source
```

---

## Built with

TypeScript, Node.js, `@polymarket/clob-client`, `ethers.js`, MongoDB, axios.

---

## Resources

- [Polymarket Leaderboard](https://polymarket.com/leaderboard) — wallet discovery
- [Original QuickNode guide](https://www.quicknode.com/guides/defi/polymarket-copy-trading-bot) — the walkthrough this project extends
- [Polymarket](https://polymarket.com), [Polygon](https://polygon.technology), [MongoDB Atlas](https://mongodb.com/atlas)

---

## License and disclaimer

ISC © [roswelly](https://github.com/roswelly)

This is educational software. It is not investment advice, not a financial product, and not audited. You are responsible for compliance with your local laws, for the security of your private keys, and for the outcomes of any trades it places. Read the code before funding a wallet.