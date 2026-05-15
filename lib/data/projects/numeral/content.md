## Why

There was this site, [numble.today](https://numble.today/) which is the same concept, a daily number guessing game. It was great at first, but it kept getting updates that made it worse. So I decided to remake it myself in one evening. Took a few hours from start to finish.

{image:1}

## How

The whole game runs client-side with no backend needed. The daily number is generated from a Linear Congruential Generator seeded by the current date:

```javascript
const lcg = (seed: number) => {
  const m = 2 ** 16;
  const c = 54321;
  const a = 22695477;
  return ((a * seed + c) % m) % 100_000;
};
```

The seed is computed from the date components:

```javascript
const seed = date.getDay() + date.getMonth() * date.getDate() + date.getFullYear();
```

This ensures every player gets the same number on any given day without needing to fetch it from a server. The result is padded to 5 digits, and there are 6 tries to guess it. After each guess, coloured tiles show how close each digit is. Like green for exact match, orange for off by 1-2, red for off by 5+, and purple for the joker digit.

## Tech Stack

Built with **Next.js 14+** (App Router), **TypeScript**, **Tailwind CSS**, and **Sonner** for toast notifications. State is managed locally with daily resets, and the UI is fully responsive with bilingual support (English/French).
