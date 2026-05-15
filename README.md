# pancake.wtf

Personal portfolio — built with Next.js, Tailwind CSS, and Framer Motion.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Font**: Plus Jakarta Sans
- **Markdown**: marked + marked-highlight + highlight.js
- **Icons**: Heroicons

## Structure

```
app/
├── page.tsx              # home page
├── layout.tsx            # root layout, SEO, fonts
├── globals.css           # theme variables, prose, animations
├── work/
│   ├── page.tsx          # gallery grid of all projects
│   └── [slug]/           # individual project page
│       ├── page.tsx      # server: marked rendering + metadata
│       └── client.tsx    # client: layout, animations, code copy
└── crafts/
    ├── page.tsx          # listing of crafts
    └── [slug]/           # individual craft page

components/
├── sections/             # hero, grid-section, section-card, coming-soon
├── ui/                   # entry-row, polaroid-stack
├── effects/              # animated-svg, sparkles, pancake, image-effects (lightbox/reveal)
├── markdown/             # code-block (copy button)
└── crafts/stickers/      # sticker drag-and-drop app

lib/
├── types.ts              # Project, Craft, etc.
├── utils.ts              # shared: slugify, formatDate, byDate, STICKER_*
├── constants.ts          # NAME, DESCRIPTION, GITHUB, LAST_UPDATED
├── age.ts                # getAge()
└── data/
    ├── projects/         # per-project folders with index.ts + content.md
    └── crafts/           # per-craft folders
```

## Development

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # eslint
```

## Projects

Each project lives in `lib/data/projects/<slug>/` with:
- `index.ts` — metadata (title, description, tags, images, dates, links, collaborators)
- `content.md` — markdown body with `{image:N}` placeholders

Images go in `public/projects/<slug>/`.
