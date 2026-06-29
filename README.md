# Monster Motel

Monster Motel is a small HTML5 casual management game prototype designed to be playable without spoken or written language inside the game. Players assign cute monsters to motel rooms by matching visual needs and room icons.

## How to play

Open `index.html` in any modern browser. Because the game now uses native ES modules, using a tiny local static server is recommended during development:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

The game uses icons only:

- Choose a monster.
- Choose a compatible room.
- Upgrade rooms with useful features.
- Press the moon button to pass the night.
- Earn coins and stars while keeping chaos low.

## Development

This is a dependency-free static web project. It is intentionally kept simple so it can run from a basic shared PHP host, itch.io, or any static web server. The browser runtime uses only standard HTML, CSS, JavaScript, DOM APIs, and `localStorage`.

Recommended local checks before publishing changes:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000> and play through at least one night.

## Modular architecture

The game is split into small dependency-free modules under `src/`. The split is deliberately conservative: gameplay formulas, icons, layout classes, persisted storage key, DOM IDs, and modal/toast behavior are preserved from the original single-file implementation.

```text
monster-motel/
├── index.html              # Static HTML shell and accessible controls
├── LICENSE                 # Apache License 2.0 for the code
├── README.md               # Project overview, architecture, development, and publishing notes
├── SECURITY.md             # Security policy and responsible disclosure notes
├── src/
│   ├── audio.js            # Silent audio/feedback boundary for future sound without changing UX
│   ├── data.js             # Static gameplay data: features, monsters, shop items, events
│   ├── game-state.js       # State creation, validation, queue generation, scoring, random events
│   ├── game.js             # Application orchestration and gameplay command handlers
│   ├── input.js            # Top-level control binding
│   ├── persistence.js      # localStorage save/load boundary
│   ├── rendering.js        # DOM rendering for rooms, queue, shop, stats, and events
│   ├── ui.js               # Shared UI helpers: element lookup, modals, events, toasts
│   └── utils.js            # Small generic helpers
└── styles/
    └── style.css           # Visual layout, responsive rules, and animations
```

### Module responsibilities

- **Rendering (`src/rendering.js`)** owns DOM creation for the game board while receiving state, current selection, and event callbacks from the orchestrator.
- **Game state (`src/game-state.js`)** owns deterministic rules such as default rooms, queue sizing, fit scores, emoji fit labels, validation, and random event selection.
- **Input handling (`src/input.js`)** binds persistent page-level buttons to injected handlers. Dynamic card/room/shop click handlers are attached by the renderer when those nodes are recreated.
- **Audio (`src/audio.js`)** provides an explicit no-op feedback boundary. Monster Motel remains silent exactly as before, but future sound effects can be added here without coupling audio code to game rules or rendering.
- **Persistence (`src/persistence.js`)** isolates `localStorage` access behind safe load/save helpers and keeps the same `monster-motel-v1` key.
- **UI (`src/ui.js`)** owns modal, toast, and small reusable DOM helpers.
- **Application orchestration (`src/game.js`)** coordinates modules and contains the high-level commands: fresh game, load game, room click, guest click, shop click, and passing the night.

### Compatibility notes

- No package manager, build step, transpiler, bundler, or runtime dependency is required.
- JavaScript uses native ES modules, which are supported by modern browsers.
- For local development, serve the folder over HTTP instead of opening `index.html` directly if a browser blocks module imports from `file://` URLs.
- The project remains suitable for static hosting and simple shared hosting environments.

## Publishing on itch.io

1. Create a ZIP containing `index.html`, `src/`, `styles/`, `LICENSE`, and `README.md`.
2. Create a new itch.io project.
3. Choose HTML as the game type.
4. Upload the ZIP.
5. Enable "This file will be played in the browser".
6. Publish.

## Design principles

- Playable without language.
- Friendly for all ages.
- No violence, politics, real countries, religions, or cultural stereotypes.
- Monsters are guests, not enemies.
- Humor should be visual, gentle, and universal.
- Keep the project dependency-free unless there is a strong maintenance reason.
- Prefer small, conservative changes that do not alter gameplay or visual appearance.

## Security and privacy impact

- The game does not make network requests.
- The game does not use third-party scripts or dependencies.
- Persistence remains limited to the existing browser `localStorage` save data.
- No secrets, tokens, accounts, or private configuration are required.

## License

Code released under the Apache License 2.0.

The name "Monster Motel", future logos, branding, and original non-code assets may be reserved separately by the project owner if desired.
