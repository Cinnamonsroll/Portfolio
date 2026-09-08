## Why

Saving a link is easy. Saving a color swatch, a phone number, a code snippet, a regex pattern? That usually means a different app, or worse, a random note somewhere. I wanted one place to put everything I want to keep track of.

Kivo is a bookmarking tool, but not just for URLs. It handles twelve different data types: `url`, `text`, `number`, `phone`, `location`, `color`, `image`, `date`, `code`, `regex`, `ip`, and `email`. Each one gets its own display and interaction. A phone number becomes a clickable link. A color shows a preview swatch. A code snippet gets syntax highlighting.

{image:1}

## How It Works

Every bookmark gets a single home. From there, you can add it to as many collections as you like. There are no duplicates, no copies to keep in sync. If you update a bookmark in one place, it updates everywhere it appears.

Collections work like folders, but lighter. You can organize by topic, project, mood, whatever. The same link can live in your "research" collection and your "inspiration" collection without existing twice.

{image:2}

## Tech Stack

Built with **React** and **TypeScript**. The frontend handles all twelve data types with custom renderers, and collections are just references, not copies.
