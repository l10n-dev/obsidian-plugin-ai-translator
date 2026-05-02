import { Menu, Plugin, TAbstractFile, TFile } from "obsidian";
import { L10nSettings } from "./types";
import { DEFAULT_SETTINGS, L10nSettingsTab } from "./settings";
import { translateActiveNote, translateToLastLanguage } from "./translator";

export default class L10nPlugin extends Plugin {
	settings: L10nSettings = { ...DEFAULT_SETTINGS };

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("languages", "Translate note", () => {
			translateActiveNote(this);
		});

		this.addCommand({
			id: "translate-current-note",
			name: "Translate current note",
			callback: () => {
				translateActiveNote(this);
			},
		});

		this.addCommand({
			id: "translate-to-last-language",
			name: "Translate to last used language",
			callback: () => {
				translateToLastLanguage(this);
			},
		});

		this.registerEvent(
			this.app.workspace.on(
				"file-menu",
				(menu: Menu, abstractFile: TAbstractFile) => {
					if (!(abstractFile instanceof TFile)) return;
					menu.addItem((item) => {
						item.setTitle("Translate…")
							.setIcon("languages")
							.onClick(() => {
								translateActiveNote(this, abstractFile);
							});
					});
				},
			),
		);

		this.registerEvent(
			this.app.workspace.on(
				"file-menu",
				(menu: Menu, abstractFile: TAbstractFile) => {
					if (!(abstractFile instanceof TFile)) return;
					menu.addItem((item) => {
						item.setTitle("Translate to last used language")
							.setIcon("languages")
							.onClick(() => {
								translateToLastLanguage(this, abstractFile);
							});
					});
				},
			),
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu) => {
				menu.addItem((item) => {
					item.setTitle("Translate to last used language")
						.setIcon("languages")
						.onClick(() => {
							translateToLastLanguage(this);
						});
				});
			}),
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu: Menu) => {
				menu.addItem((item) => {
					item.setTitle("Translate…")
						.setIcon("languages")
						.onClick(() => {
							translateActiveNote(this);
						});
				});
			}),
		);

		this.addSettingTab(new L10nSettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<L10nSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
