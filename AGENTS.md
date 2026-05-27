# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript single-page detective game. Source lives in `src/`:

- `src/App.tsx` switches between home and chat views; there is no router.
- `src/components/` contains feature components; shadcn-style primitives live in `src/components/ui/`.
- `src/hooks/use-game-session.ts` owns chat state, session lifecycle, retries, and image URL cleanup.
- `src/lib/` contains API calls, case seeding, and utility helpers.
- `src/types.ts` defines shared response and state types.
- `public/` stores static assets such as `home-screen-illustration.jpg` and icons.
- Root prompt files, including `main_system_prompt.md` and `case_file_generator_prompt.md`, define backend agent behavior.

Build output goes to `dist/` and should not be edited.

## Build, Test, and Development Commands

Use pnpm for local work:

```bash
pnpm dev       # Start the Vite dev server on http://localhost:5173
pnpm build     # Run TypeScript checks, then create the production bundle
pnpm lint      # Run ESLint across the repository
pnpm preview   # Preview the production build locally
```

Add UI primitives with `pnpm dlx shadcn@latest add <component>`; generated files go in `src/components/ui/`.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and 2-space indentation. Components export PascalCase names, while filenames are kebab-case, for example `chat-screen.tsx`. Hooks must start with `use`.

Prefer the `@/*` alias for imports from `src/`. Styling uses Tailwind v4 tokens from `src/index.css`; prefer existing noir theme tokens over new hex colors. Use `cn()` from `src/lib/utils.ts` for conditional classes. Keep user-facing UI text in Mongolian.

## Testing Guidelines

No test framework or `pnpm test` script is currently configured. Before submitting changes, run:

```bash
pnpm lint
pnpm build
```

For behavior changes, manually verify the main flow: start a case, send a chat message, confirm narrative rendering, image fallback behavior, history sheet display, retry behavior, and quitting to home.

## Commit & Pull Request Guidelines

Recent commits use short summaries with optional scopes, such as `db: case file seeder` and `db(feat): history sheet`. Keep commits focused and name the affected area first when useful.

Pull requests should include a concise description, testing notes, and screenshots or screen recordings for visible UI changes. Link related issues when available. Call out backend webhook or prompt-file changes because they affect the n8n agent contract.

## Security & Configuration Tips

The app calls n8n webhooks from `src/lib/api.ts`. Do not commit secrets, private webhook variants, or environment credentials. If backend response shape changes, update `sendChat` carefully; it handles n8n’s wrapped `output` response.
