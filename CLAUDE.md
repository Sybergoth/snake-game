# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project for a snake game, bootstrapped with `create-next-app`. It uses:
- React 19
- TypeScript
- Tailwind CSS v4 with PostCSS
- ESLint with Next.js configuration
- Geist fonts (Sans and Mono)

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture

### Project Structure
- `/src/app/` - Next.js App Router structure
  - `layout.tsx` - Root layout with Geist fonts and global styles
  - `page.tsx` - Homepage (currently default Next.js template)
  - `globals.css` - Global styles with Tailwind and CSS custom properties
- `/public/` - Static assets (SVG icons)

### Styling
- Uses Tailwind CSS v4 with PostCSS plugin
- CSS custom properties for theming (light/dark mode support)
- Geist Sans and Mono fonts configured via next/font/google

### TypeScript Configuration
- Strict mode enabled
- Path mapping: `@/*` → `./src/*`
- Next.js plugin for enhanced TypeScript support

## Development Notes

- The project currently contains the default Next.js template
- Dark mode support is built into the CSS with `prefers-color-scheme`
- Turbopack is enabled for faster development builds