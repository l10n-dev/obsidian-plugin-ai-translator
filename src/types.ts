export interface Language {
	code: string;
	name: string;
}

export type OutputBehavior = "new-note" | "replace" | "append";

export interface L10nSettings {
	apiKey: string;
	outputBehavior: OutputBehavior;
	translateFrontmatter: boolean;
	generateGlossary: boolean;
	lastLanguage?: Language;
}

export interface TranslateRequest {
	sourceStrings: string;
	targetLanguageCode: string;
	format?: string;
	useContractions?: boolean;
	translateMetadata?: boolean;
	generateGlossary?: boolean;
	client?: string;
}

export interface TranslationUsage {
	charsUsed: number;
	details: {
		sourceStringsCharCount: number;
		terminologyCharCount: number;
		glossaryCharCount: number;
		instructionCharCount: number;
	};
}

export interface TranslateResponse {
	translations: string;
	finishReason: string;
	usage: TranslationUsage;
	remainingBalance?: number | null;
}

export interface BalanceResponse {
	currentBalance: number;
}

import type { App } from "obsidian";

export interface PluginWithSettings {
	app: App;
	settings: L10nSettings;
	saveSettings(): Promise<void>;
}
