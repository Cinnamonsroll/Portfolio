## Overview

This is my personal portfolio website(aka the one you're currently seeing), built with Next.js and Tailwind CSS. Dark theme with warm golden accents, polaroid-style image stacks, and scroll-triggered reveals.

Design inspiration came from [ja.mt](https://ja.mt/), the clean layout, focus on typography, and letting the content breathe without getting in the way.

{image:1}

## Features

- Animated SVG signature drawn on load using framer-motion
- Polaroid-style image stacks that fan out on hover
- 2x2 grid layout with italic section headings
- Full-page focus blur when hovering projects
- Cursor-following sparkle effect on the signature
- Dark theme with custom golden accent color

{image:2}

## Tech Stack

Built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **framer-motion** for animations. Project data is fully typed with TypeScript. Icons from Heroicons, decorative elements are custom SVGs.

{image:3}

## What I Learned

CSS custom properties for hover-driven transforms, framer-motion path animations, and keeping the component architecture clean. The polaroid stack effect uses CSS variables so Tailwind's group-hover can override them without React state.
