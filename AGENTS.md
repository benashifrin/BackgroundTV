# Repository Guidelines

## IMPORTANT INSTRUCTIONS
- Before using or writing ANY code that requires external API docs or libraries, you MUST use the Context tools you have accesf to, to pull the latest documentation and ensure your code is up to date and accurate.

## Project Structure & Module Organization

Suggested layout (create missing folders as needed):
- `src/`: application code. Entry `src/main.js`; group code under `src/components/`, `src/lib/`, `src/styles/`.
- `public/`: static assets (e.g., `index.html`, icons, media).
- `test/`: unit/integration tests.
- `scripts/`: local build/dev helpers.
- `.github/`: issue/PR templates and CI.
- `assets/`: images/video used at runtime (referenced by code).

Keep modules small and focused. Prefer composition over large files. Use clear import paths (e.g., `src/lib/referrals.js`).

## Build, Test, and Development Commands

Run inside the repo root after dependencies are installed.
- `npm install`: install dependencies.
- `npm run dev`: start local dev server with hot reload (configure in `package.json`).
- `npm run build`: produce an optimized production build to `dist/`.
- `npm test`: run unit tests.
- `npm run lint` / `npm run format`: check/fix style.

Example scripts in `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

## Coding Style & Naming Conventions

- Indentation: 2 spaces; include semicolons; single quotes; trailing commas where valid.
- Files: kebab-case (`background-player.js`); classes: PascalCase; functions/variables: camelCase; constants: UPPER_SNAKE_CASE.
- Linting/formatting: ESLint (recommended + import rules) and Prettier. Fix with `npm run lint -- --fix` and `npm run format`.

## Testing Guidelines

- Framework: Vitest or Jest. Place tests next to code (`module.test.js`) or under `test/` mirroring `src/`.
- Naming: `*.test.js` or `*.spec.js`.
- Aim for >80% coverage on core modules (referral parsing, playlist/rotation, timers). Run with `npm test`.

## Commit & Pull Request Guidelines

- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Example: `feat(player): auto-rotate backgrounds`.
- PRs: concise description, linked issues (`#123`), screenshots or short clips for UI changes, test plan/steps, and check CI green.

## Security & Configuration Tips

- Never commit secrets. Use `.env.local`; add `.env*` to `.gitignore`. Provide `/.env.example` with placeholders.
- Validate and sanitize any user-supplied URLs/HTML. Lock deps (`package-lock.json`) and run `npm audit` regularly.
