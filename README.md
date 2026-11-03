# Minh Nguyen — Desk Portfolio

An interactive 3D office desk built with three.js. Every object on the desk is a section of the portfolio. Hover an object to see a preview box; click it to fly the camera in and open its panel.

| Object | Section |
| --- | --- |
| Photo frame | About me |
| Walmart mug | Walmart Global Tech |
| Dumbbell | Everfit.io |
| CRT computer | Projects (the screen switches to a project listing) |
| Keyboard | Skills |
| Books + grad cap | Education |
| Cactus | Off the clock |
| Paper + pencil | Résumé (PDF) |
| Phone | Contact |
| Desk lamp | Toggles the light |

Navigation: click objects or the hotspot dots, use the ‹ › buttons or arrow keys, open the section menu from the bottom bar, and press Esc (or click empty space) to return to the whole desk. On phones the panel becomes a bottom sheet.

The VHS look is a port of the CC0 "Fears to Fathom Shader" by theCube (godotshaders.com), run as the last post-processing pass (`src/fearsShader.js`).

## Run

```bash
npm install
npm run dev
```

```bash
npm run build
```

The production site lands in `dist/` and can be deployed as static files (Vercel, Netlify, GitHub Pages).

## Where things live

- `src/content.js` — all text: sections, links, nav order
- `src/world.js` — the room, lights and every desk object
- `src/textures.js` — canvas-drawn textures (mug print, CRT terminal, clock, corkboard, book spines)
- `src/fearsShader.js` — the post-processing shader
- `src/main.js` — renderer, loader, camera moves, hover/click, panel and nav
- `public/` — portrait photo and résumé PDF
