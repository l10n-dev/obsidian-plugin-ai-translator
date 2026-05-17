export interface Language {
	code: string;
	name: string;
}

export type OutputBehavior = "new-note" | "replace" | "append";

export interface L10nSettings {
	apiKey: string;
	outputBehavior: OutputBehavior;
	translateFrontmatter: boolean;
	lastLanguage?: Language;
}

export interface TranslateRequest {
	sourceStrings: string;
	targetLanguageCode: string;
	format?: string;
	useContractions?: boolean;
	translateMetadata?: boolean;
	client?: string;
}

export interface TranslateResponse {
	translations: string;
	finishReason: string;
	usage: { charsUsed: number };
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
