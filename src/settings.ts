import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { L10nSettings, OutputBehavior, PluginWithSettings } from "./types";
import { TranslationService } from "./TranslationService";
import { t, localizeUrl, getLocale, URLS } from "./i18n";

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

		new Setting(containerEl).setName(t("settingHeading")).setHeading();

		// Balance refresh helper (defined before API key so onChange can call it)
		const refreshBalance = (apiKey: string) => {
			if (!apiKey) {
				quotaEl.setText(
					t("settingBalanceFree", {
						count: (10000).toLocaleString(),
					}),
				);
				return;
			}
			quotaEl.setText(t("settingBalanceLoading"));
			TranslationService.getBalance(apiKey)
				.then((res) => {
					quotaEl.setText(
						t("settingBalanceCount", {
							count: res.currentBalance.toLocaleString(),
						}),
					);
				})
				.catch(() => {
					quotaEl.setText(
						t("settingBalanceFree", {
							count: (10000).toLocaleString(),
						}),
					);
				});
		};

		// API Key
		const apiKeySetting = new Setting(containerEl)
			.setName(t("settingApiKeyName"))
			.addText((text) => {
				text.inputEl.type = "password";
				text.setPlaceholder(t("settingApiKeyPlaceholder"))
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value.trim();
						await this.plugin.saveSettings();
						refreshBalance(this.plugin.settings.apiKey);
					});
			});
		apiKeySetting.descEl.appendText(t("settingApiKeyDescPrefix"));
		apiKeySetting.descEl.createEl("a", {
			text: localizeUrl(URLS.API_KEYS, getLocale()).replace(
				/^https?:\/\//,
				"",
			),
			href: localizeUrl(URLS.API_KEYS, getLocale()),
			attr: { target: "_blank", rel: "noopener noreferrer" },
		});

		// Quota display
		const quotaSetting = new Setting(containerEl)
			.setName(t("settingBalanceName"))
			.setDesc(t("settingBalanceDesc"))
			.addButton((btn) => {
				btn.setButtonText(t("settingBalanceBuyBtn")).onClick(() => {
					window.open(
						localizeUrl(URLS.PRICING, getLocale()),
						"_blank",
					);
				});
			});
		const quotaEl = quotaSetting.descEl.createEl("span", { text: "" });

		// Initial balance fetch
		refreshBalance(this.plugin.settings.apiKey);

		// Output behavior
		new Setting(containerEl)
			.setName(t("settingOutputName"))
			.setDesc(t("settingOutputDesc"))
			.addDropdown((dropdown) => {
				dropdown
					.addOption("new-note", t("settingOutputNewNote"))
					.addOption("replace", t("settingOutputReplace"))
					.addOption("append", t("settingOutputAppend"))
					.setValue(this.plugin.settings.outputBehavior)
					.onChange(async (value) => {
						this.plugin.settings.outputBehavior =
							value as OutputBehavior;
						await this.plugin.saveSettings();
					});
			});

		// Translate frontmatter
		new Setting(containerEl)
			.setName(t("settingFrontmatterName"))
			.setDesc(t("settingFrontmatterDesc"))
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
			.setName(t("settingGlossaryName"))
			.setDesc(t("settingGlossaryDesc"))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.generateGlossary)
					.onChange(async (value) => {
						this.plugin.settings.generateGlossary = value;
						await this.plugin.saveSettings();
					});
			});

		glossarySetting.descEl.createEl("a", {
			text: t("settingGlossaryManageLink"),
			href: localizeUrl(URLS.GLOSSARY, getLocale()),
			attr: { target: "_blank", rel: "noopener noreferrer" },
			cls: "inline-link",
		});
		glossarySetting.descEl.createEl("a", {
			text: t("settingLinguisticLink"),
			href: localizeUrl(URLS.LINGUISTIC, getLocale()),
			attr: { target: "_blank", rel: "noopener noreferrer" },
			cls: "inline-link",
		});
	}
}
