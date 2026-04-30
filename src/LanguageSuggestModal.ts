import { App, SuggestModal } from "obsidian";
import { Language } from "./types";
import { TranslationService } from "./TranslationService";

export class LanguageSuggestModal extends SuggestModal<Language> {
	private onSelect: (lang: Language) => void;
	private lastLanguage: Language | undefined;
	private debounceTimer: number | null = null;

	constructor(
		app: App,
		lastLanguage: Language | undefined,
		onSelect: (lang: Language) => void,
	) {
		super(app);
		this.lastLanguage = lastLanguage;
		this.onSelect = onSelect;
		this.setPlaceholder(
			lastLanguage
				? `Last used: ${lastLanguage.name} — type to change…`
				: "Type a language name (e.g. Spanish, German)…",
		);
	}

	async getSuggestions(query: string): Promise<Language[]> {
		if (!query.trim()) {
			return this.lastLanguage ? [this.lastLanguage] : [];
		}
		return new Promise((resolve) => {
			if (this.debounceTimer !== null) {
				window.clearTimeout(this.debounceTimer);
			}
			this.debounceTimer = window.setTimeout(() => {
				this.debounceTimer = null;
				TranslationService.predictLanguages(query)
					.then(resolve)
					.catch(() => resolve([]));
			}, 300);
		});
	}

	renderSuggestion(lang: Language, el: HTMLElement): void {
		el.createEl("span", { text: `${lang.name} — ${lang.code}` });
		if (this.lastLanguage?.code === lang.code) {
			el.createEl("span", {
				text: "Last used",
				cls: "ai-translator-last-used-badge",
			});
		}
	}

	onChooseSuggestion(lang: Language): void {
		this.onSelect(lang);
	}
}
