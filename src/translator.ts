import { Notice, TFile } from "obsidian";
import { LanguageSuggestModal } from "./LanguageSuggestModal";
import { TranslationService } from "./TranslationService";
import { Language, PluginWithSettings } from "./types";

const FRONTMATTER_REGEX = /^(---\r?\n[\s\S]*?\r?\n---\r?\n?)([\s\S]*)$/;

function splitFrontmatter(
	content: string,
): { frontmatter: string; body: string } | null {
	const match = FRONTMATTER_REGEX.exec(content);
	if (!match) return null;
	return { frontmatter: match[1] ?? "", body: match[2] ?? "" };
}

async function doTranslate(
	plugin: PluginWithSettings,
	file: TFile,
	lang: Language,
): Promise<void> {
	let content: string;
	try {
		content = await plugin.app.vault.read(file);
	} catch {
		new Notice("Failed to read the note.");
		return;
	}

	let sourceText = content;
	let frontmatter = "";
	if (!plugin.settings.translateFrontmatter) {
		const parsed = splitFrontmatter(content);
		if (parsed) {
			frontmatter = parsed.frontmatter;
			sourceText = parsed.body;
		}
	}

	let translated: string;
	let charsUsed = 0;
	let remainingBalance: number | null | undefined;
	const progressNotice = new Notice("Translating…", 0);
	try {
		const result = await TranslationService.translate(
			plugin.settings.apiKey,
			{
				sourceStrings: sourceText,
				targetLanguageCode: lang.code,
				format: "md",
				useContractions: true,
				translateMetadata: plugin.settings.translateFrontmatter,
			},
		);
		translated = result.translations;
		charsUsed = result.usage.charsUsed;
		remainingBalance = result.remainingBalance;
	} catch (err) {
		progressNotice.hide();
		const msg = err instanceof Error ? err.message : "";
		if (msg === "unauthorized") {
			new Notice(
				"Invalid API key. Get your key at https://l10n.dev/ws/keys",
			);
		} else if (msg === "quota_exceeded") {
			new Notice(
				"Insufficient balance. Top up at https://l10n.dev/#pricing",
			);
		} else {
			new Notice("Translation failed. Please try again.");
		}
		return;
	}
	progressNotice.hide();

	const outputContent = frontmatter + translated;
	const { outputBehavior } = plugin.settings;

	try {
		if (outputBehavior === "replace") {
			await plugin.app.vault.modify(file, outputContent);
		} else if (outputBehavior === "append") {
			await plugin.app.vault.modify(
				file,
				content + "\n\n---\n\n" + translated,
			);
		} else {
			// new-note (default)
			const folder = file.parent ? file.parent.path : "";
			const newPath =
				(folder && folder !== "/" ? folder + "/" : "") +
				`${file.basename} (${lang.code}).md`;
			const existing = plugin.app.vault.getAbstractFileByPath(newPath);
			if (existing instanceof TFile) {
				await plugin.app.vault.modify(existing, outputContent);
			} else {
				await plugin.app.vault.create(newPath, outputContent);
			}
		}
		const balanceText =
			remainingBalance != null
				? ` ${remainingBalance.toLocaleString()} characters remaining.`
				: "";
		new Notice(
			`Translation complete. Used ${charsUsed.toLocaleString()} characters.${balanceText}`,
		);
	} catch {
		new Notice("Failed to save the translated note.");
	}
}

export function translateActiveNote(
	plugin: PluginWithSettings,
	targetFile?: TFile,
): void {
	if (!plugin.settings.apiKey) {
		new Notice("Please set your l10n.dev API key in settings.");
		return;
	}

	const file = targetFile ?? plugin.app.workspace.getActiveFile();
	if (!file) {
		new Notice("No active note to translate.");
		return;
	}

	new LanguageSuggestModal(
		plugin.app,
		plugin.settings.lastLanguage,
		(lang) => {
			plugin.settings.lastLanguage = lang;
			void plugin.saveSettings();
			void doTranslate(plugin, file, lang);
		},
	).open();
}

export function translateToLastLanguage(
	plugin: PluginWithSettings,
	targetFile?: TFile,
): void {
	const lang = plugin.settings.lastLanguage;
	if (!lang) {
		return translateActiveNote(plugin, targetFile);
	}

	if (!plugin.settings.apiKey) {
		new Notice("Please set your l10n.dev API key in settings.");
		return;
	}

	const file = targetFile ?? plugin.app.workspace.getActiveFile();
	if (!file) {
		new Notice("No active note to translate.");
		return;
	}

	void doTranslate(plugin, file, lang);
}
