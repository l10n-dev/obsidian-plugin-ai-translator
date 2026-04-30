import { requestUrl } from "obsidian";
import {
	BalanceResponse,
	Language,
	TranslateRequest,
	TranslateResponse,
} from "./types";

const API_BASE = "https://api.l10n.dev";

export class TranslationService {
	static async getBalance(apiKey: string): Promise<BalanceResponse> {
		const response = await requestUrl({
			url: `${API_BASE}/v2/balance`,
			method: "GET",
			headers: { "X-API-Key": apiKey },
			throw: false,
		});
		if (response.status === 401) throw new Error("unauthorized");
		if (response.status !== 200) throw new Error("network_error");
		return response.json as BalanceResponse;
	}

	static async predictLanguages(input: string): Promise<Language[]> {
		const response = await requestUrl({
			url: `${API_BASE}/v2/languages/predict?input=${encodeURIComponent(input)}&limit=10`,
			method: "GET",
			throw: false,
		});
		if (response.status !== 200) return [];
		const body = response.json as { languages?: Language[] };
		return body.languages ?? [];
	}

	static async translate(
		apiKey: string,
		req: TranslateRequest,
	): Promise<TranslateResponse> {
		console.debug("[AI Translator] Sending translation request:", req);
		const response = await requestUrl({
			url: `${API_BASE}/v2/translate`,
			method: "POST",
			headers: {
				"X-API-Key": apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(req),
			throw: false,
		});
		if (response.status === 401) throw new Error("unauthorized");
		if (response.status === 402) throw new Error("quota_exceeded");
		if (response.status !== 200) throw new Error("network_error");
		return response.json as TranslateResponse;
	}
}
