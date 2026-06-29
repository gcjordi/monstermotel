# Monster Motel

Monster Motel is a small HTML5 casual management game prototype designed to be playable without spoken or written language inside the game. Players assign cute monsters to motel rooms by matching visual needs and room icons.

## How to play

Open `index.html` in any modern browser.

The game uses icons only:

- Choose a monster.
- Choose a compatible room.
- Upgrade rooms with useful features.
- Press the moon button to pass the night.
- Earn coins and stars while keeping chaos low.

## Development

This is a dependency-free static web project. It is intentionally kept simple so it can run from a local file, a basic shared PHP host, itch.io, or any static web server.

Recommended local checks before publishing changes:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000> and play through at least one night.

## Publishing on itch.io

1. Create a ZIP containing `index.html`, `src/`, `styles/`, `LICENSE`, and `README.md`.
2. Create a new itch.io project.
3. Choose HTML as the game type.
4. Upload the ZIP.
5. Enable "This file will be played in the browser".
6. Publish.

## Project structure

```text
monster-motel/
├── index.html          # Static HTML shell and accessible controls
├── LICENSE             # Apache License 2.0 for the code
├── README.md           # Project overview, development, and publishing notes
├── SECURITY.md         # Security policy and responsible disclosure notes
├── src/
│   └── game.js         # Game state, rendering, persistence, and interactions
└── styles/
    └── style.css       # Visual layout, responsive rules, and animations
```

## Design principles

- Playable without language.
- Friendly for all ages.
- No violence, politics, real countries, religions, or cultural stereotypes.
- Monsters are guests, not enemies.
- Humor should be visual, gentle, and universal.
- Keep the project dependency-free unless there is a strong maintenance reason.
- Prefer small, conservative changes that do not alter gameplay or visual appearance.

## License

Code released under the Apache License 2.0.

The name "Monster Motel", future logos, branding, and original non-code assets may be reserved separately by the project owner if desired.
