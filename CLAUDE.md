# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`create-lve` is a pnpm-only scaffolding CLI (`index.js` + `config.js`, plain ESM JS, no build step). `template-react/` and `template-vue/` are copied verbatim into users' new projects, so every file there ships to end users. Each template has its own `AGENTS.md` describing its architecture — follow it when editing that template: @template-react/AGENTS.md @template-vue/AGENTS.md

## Gotchas

- The list of template artifacts to exclude (`node_modules`, `dist`, `.tanstack`, `pnpm-lock.yaml`, `coverage`, `playwright-report`, `test-results`, `src/routeTree.gen.ts`) is duplicated in: the copy filter in `index.js`, `cleanupTemplate` in `config.js`, `files` in `package.json`, and `.gitignore`. Keep them in sync. The root `.npmignore` has no effect while `files` is set.
- `template-vue/TODO.md` is a maintainer note, excluded from the npm package and from generated projects.
- Templates use `_gitignore` (npm drops `.gitignore` from packages); the CLI renames it. Never add a `.gitignore` inside a template.
- The CLI rewrites the generated `package.json` `name` / `packageManager` and replaces `<title>` and `__APP_NAME__` in `index.html`.
- `template-react/src/routeTree.gen.ts` is generated — never edit it.
- All CLI user-facing text is Chinese, and `test/cli.test.js` asserts on those strings. Update tests when wording changes.
- Style is oxfmt with no semicolons and single quotes; each template has its own `.oxfmtrc.json` / `.oxlintrc.json`.

## Verification

- CLI changes: `pnpm check` (fmt:check + oxlint + `node --test test/cli.test.js`).
- Template changes: also `cd template-<name> && pnpm install && pnpm check` (template lockfiles are gitignored).
- `pnpm test:smoke` generates both templates, installs and builds them (slow, needs network) — ask before running it. `LVE_BROWSER_TESTS=1` adds Playwright e2e.

## Git and releases

- Small changes go directly to `main`; larger changes go on a branch with a PR.
- Commits use Conventional Commits with scopes, e.g. `fix(react): …`, `refactor(template-react): …`.
- Never bump `version` by hand. Releases use `pnpm release:patch|minor|major` (see `RELEASING.md`), which tags and pushes, and that triggers the npm publish. Only run a release when asked.
