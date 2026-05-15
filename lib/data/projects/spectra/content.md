## Why

ShareX has a color picker, but I wanted more more formats, harmonies, history, and a cleaner interface. Something lightweight that lives in the system tray and pops up with a global shortcut. So I built Spectra.

{image:1}

## Features

- Real-time colour picking from anywhere on screen
- HEX, RGB, HSL, and CMYK formats
- Color history and harmonies
- Global shortcut (`Ctrl+.`) to activate instantly
- System tray integration for quick access to settings

## Tech Stack

Built with **Tauri** (Rust backend + TypeScript frontend), **Vite**, and **React**. The colour picking logic runs natively through Tauri's IPC, and the window sits as a compact overlay that can be summoned from anywhere.
