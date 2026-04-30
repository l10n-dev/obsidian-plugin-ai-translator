# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-04-28

### Added

- Translate the active note via the command palette ("Translate current note"), ribbon icon, and right-click context menus (file explorer and editor)
- Dynamic language picker using `SuggestModal` — searches [l10n.dev](https://l10n.dev) in real time with a 300 ms debounce; no hardcoded language list
- Three output modes configurable in settings:
  - **Create a new note** (default) — saves translation as `{filename} ({lang-code}).md` in the same folder
  - **Replace current note content** — overwrites the note in place
  - **Append to current note** — appends translation below a horizontal rule
- YAML frontmatter toggle — when disabled, frontmatter is preserved verbatim and only the note body is sent for translation
- Success notice shows characters used and remaining balance from the API response
- Secure API key input (password-masked) in settings
- Async balance display in settings tab — fetches current character balance when the tab is opened
- Typed error handling: 401 Unauthorized and 402 Payment Required surface actionable notices with direct links to [l10n.dev/ws/keys](https://l10n.dev/ws/keys) and [l10n.dev/#pricing](https://l10n.dev/#pricing)
- Mobile-compatible — all network calls use Obsidian's `requestUrl`; no Node.js or Electron APIs used
