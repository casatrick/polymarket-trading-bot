import ora, { Ora } from 'ora';

const ANSI = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m',
};

const paint = (color: string, text: string) => `${color}${text}${ANSI.reset}`;

// Smooth braille frames — the de-facto modern terminal spinner look.
// 10 frames rotating at 80ms gives a clean, fluid motion.
const brailleFrames = [
    '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏',
];

const spinner: Ora = ora({
    spinner: {
        interval: 80,
        frames: brailleFrames.map((f) => paint(ANSI.cyan + ANSI.bold, f)),
    },
    color: 'cyan',
    prefixText: paint(ANSI.dim, '◇'),
    discardStdin: false,
});

// Semantic helpers — replace the spinner line with a finalized status
// using modern glyphs (Nerd-Font-safe, unicode-only).
export const status = {
    success: (msg: string) =>
        spinner.stopAndPersist({
            symbol: paint(ANSI.green + ANSI.bold, '✔'),
            text: paint(ANSI.green, msg),
        }),
    fail: (msg: string) =>
        spinner.stopAndPersist({
            symbol: paint(ANSI.red + ANSI.bold, '✖'),
            text: paint(ANSI.red, msg),
        }),
    warn: (msg: string) =>
        spinner.stopAndPersist({
            symbol: paint(ANSI.yellow + ANSI.bold, '⚠'),
            text: paint(ANSI.yellow, msg),
        }),
    info: (msg: string) =>
        spinner.stopAndPersist({
            symbol: paint(ANSI.magenta + ANSI.bold, 'ℹ'),
            text: paint(ANSI.gray, msg),
        }),
};

export default spinner;
