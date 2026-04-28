# AI Translator for Obsidian

Translate your Obsidian notes into any language using [l10n](https://l10n.dev).dev — an AI-powered localization API. Works on desktop and mobile.

## Features

- Translate the active note via the command palette, ribbon icon, or right-click context menu
- Dynamic language search — type a language name to find it instantly (no hardcoded list)
- Remembers your last used language — one keypress to repeat the same translation
- Three output modes: create a new note, replace the current note, or append the translation
- Optional YAML frontmatter preservation — translate only the note body if desired
- Shows characters used and remaining balance after each translation
- Mobile-compatible — uses Obsidian's native network layer, no Node.js APIs

## Requirements

A free [l10n.dev](https://l10n.dev) account. You receive **30,000 characters free per month** after signing up. Get your API key at [l10n.dev/ws/keys](https://l10n.dev/ws/keys).

## Installation

### Community plugin (recommended)

1. Open **Settings → Community plugins** and select **Browse**.
2. Search for **L10n.dev - AI Translator**.
3. Select **Install**, then **Enable**.

### Manual installation

See [TESTING.md](TESTING.md) for instructions on manually copying the plugin into your vault.

## Setup

1. Open **Settings → L10n.dev - AI Translator**.
2. Paste your l10n.dev API key into the **API key** field.
3. Choose your preferred **Output behavior** and toggle **Translate frontmatter** as needed.

## Usage

With a note open, trigger translation in any of these ways:

- **Command palette** — run `Translate current note`
- **Ribbon** — select the globe icon in the left sidebar
- **Context menu** — right-click a file in the file explorer or inside the editor and select **Translate…**

A language picker will open. Type a language name (e.g. "Spanish", "German", "Japanese") and select your target language. The translation will be saved according to your output behavior setting.

### Repeat translation to the same language

After your first translation, the last used language is saved automatically. The next time the language picker opens, it pre-selects that language — press Enter to confirm without typing anything.

For even faster repeat translations, use the **Translate to last used language** command from the command palette. It skips the language picker entirely and translates immediately. Assign a hotkey to it in **Settings → Hotkeys** for one-keystroke translation.

## Output behavior

| Setting | Result |
|---|---|
| Create a new note (default) | Saves translation as `{filename} ({lang-code}).md` in the same folder |
| Replace current note content | Overwrites the current note with the translation |
| Append to current note | Appends the translation below a horizontal rule |

## Privacy

Translation requests are sent to the [AI translation API](https://api.l10n.dev/doc/#tag/ai-translation) over HTTPS. l10n.dev does not store your content after translation. See the [l10n.dev terms of service](https://l10n.dev/terms-of-service) for details.

No telemetry or analytics are collected by this plugin.

## Releasing

1. Update `minAppVersion` in `manifest.json` if needed.
2. Run `npm version patch` (or `minor` / `major`) — this bumps `manifest.json`, `package.json`, and `versions.json` automatically.
3. Push the tag and create a GitHub release using the exact version number (no `v` prefix).
4. Attach `manifest.json`, `main.js`, and `styles.css` as release assets.

## License

[MIT](LICENSE)
