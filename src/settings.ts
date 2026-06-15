import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { L10nSettings, OutputBehavior, PluginWithSettings } from "./types";
import { TranslationService } from "./TranslationService";

export type { L10nSettings };

export const DEFAULT_SETTINGS: L10nSettings = {
	apiKey: "",
	outputBehavior: "new-note",
	translateFrontmatter: false,
	generateGlossary: false,
};

export class L10nSettingsTab extends PluginSettingTab {
	plugin: PluginWithSettings;

	constructor(app: App, plugin: Plugin & PluginWithSettings) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName("AI translator").setHeading();

		// Balance refresh helper (defined before API key so onChange can call it)
		const refreshBalance = (apiKey: string) => {
			if (!apiKey) {
				quotaEl.setText(
					` ${(10000).toLocaleString()} characters free monthly.`,
				);
				return;
			}
			quotaEl.setText(" Loading…");
			TranslationService.getBalance(apiKey)
				.then((res) => {
					quotaEl.setText(
						` ${res.currentBalance.toLocaleString()} characters`,
					);
				})
				.catch(() => {
					quotaEl.setText(
						` ${(10000).toLocaleString()} characters free monthly.`,
					);
				});
		};

		// API Key
		const apiKeySetting = new Setting(containerEl)
			.setName("API key")
			.addText((text) => {
				text.inputEl.type = "password";
				text.setPlaceholder("Paste your API key here")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value.trim();
						await this.plugin.saveSettings();
						refreshBalance(this.plugin.settings.apiKey);
					});
			});
		apiKeySetting.descEl.appendText("Your l10n.dev API key. Get one at ");
		apiKeySetting.descEl.createEl("a", {
			text: "l10n.dev/ws/keys",
			href: "https://l10n.dev/ws/keys",
			attr: { target: "_blank", rel: "noopener noreferrer" },
		});

		// Quota display
		const quotaSetting = new Setting(containerEl)
			.setName("Remaining balance")
			.setDesc("Characters remaining for translation.")
			.addButton((btn) => {
				btn.setButtonText("Buy characters").onClick(() => {
					window.open("https://l10n.dev/#pricing", "_blank");
				});
			});
		const quotaEl = quotaSetting.descEl.createEl("span", { text: "" });

		// Initial balance fetch
		refreshBalance(this.plugin.settings.apiKey);

		// Output behavior
		new Setting(containerEl)
			.setName("Output behavior")
			.setDesc("How translated content is saved.")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("new-note", "Create a new note")
					.addOption("replace", "Replace current note content")
					.addOption("append", "Append to current note")
					.setValue(this.plugin.settings.outputBehavior)
					.onChange(async (value) => {
						this.plugin.settings.outputBehavior =
							value as OutputBehavior;
						await this.plugin.saveSettings();
					});
			});

		// Translate frontmatter
		new Setting(containerEl)
			.setName("Translate frontmatter")
			.setDesc(
				"When enabled, YAML frontmatter will be included in the translation.",
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.translateFrontmatter)
					.onChange(async (value) => {
						this.plugin.settings.translateFrontmatter = value;
						await this.plugin.saveSettings();
					});
			});

		// Generate glossary
		const glossarySetting = new Setting(containerEl)
			.setName("Generate & save glossary")
			.setDesc(
				"When enabled, creates a glossary based on the translation to ensure consistency between notes and saves it for future use. ",
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.generateGlossary)
					.onChange(async (value) => {
						this.plugin.settings.generateGlossary = value;
						await this.plugin.saveSettings();
					});
			});

		glossarySetting.descEl.createEl("a", {
			text: "Manage glossaries",
			href: "https://l10n.dev/ws/translation-glossary",
			attr: { target: "_blank", rel: "noopener noreferrer" },
		});
	}
}
