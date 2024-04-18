import { Constants } from "../Constants";
import { DisplayAreaOption } from "../models/DisplayAreaOption";

export class SettingsManager {
    public static init(ctx: Modding.ModContext) {
        // Select areas to display info
        ctx.settings.section(getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECTIONS.DISPLAY_AREA_OPTIONS)).add([
            {
                type: 'checkbox-group',
                name: 'display-area-options-selected',
                label: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.DISPLAY_AREA_OPTIONS_SELECTED.LABEL),
                options: [
                    {
                        value: DisplayAreaOption.BankItemHover,
                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.BANK_ITEM_HOVER)
                    },
                    {
                        value: DisplayAreaOption.BankItemSelected,
                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.BANK_ITEM_SELECTED)
                    },
                    {
                        value: DisplayAreaOption.CombatLootContainer,
                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.COMBAT_LOOT_CONTAINER)
                    },
                    {
                        value: DisplayAreaOption.CookingStockpiles,
                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.COOKING_STOCKPILES)
                    },
                    {
                        value: DisplayAreaOption.TownshipTraderConversions,
                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.TOWNSHIP_TRADER_CONVERSION)
                    }
                ],
                default: [
                    DisplayAreaOption.BankItemHover,
                    DisplayAreaOption.BankItemSelected,
                    DisplayAreaOption.CombatLootContainer,
                    DisplayAreaOption.CookingStockpiles,
                    DisplayAreaOption.TownshipTraderConversions
                ],
                onChange(value: string, previousValue: string): void {
                    SettingsManager.setButtonToReload();

                    const label = <HTMLElement>document.querySelector(`label[for="${Constants.MOD_NAMESPACE}:display-area-options-selected"]`);
                    if (!label) {
                        return;
                    }

                    let hint = label?.querySelector(`small`);
                    if (!hint) {
                        createElement('span', { classList: ['ms__force-wrap'], parent: label })
                        hint = createElement('small', { classList: ['d-block'], parent: label });
                    }

                    hint.textContent = getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.RELOAD_HINT);
                    hint.classList.add("text-warning");
                }
            } as Modding.Settings.CheckboxGroupConfig,
        ]);

        // Force reload, as method patching will be done based on settings
        ctx.settings.section(getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECTIONS.SAVE_AND_RELOAD)).add([
            {
                type: "button",
                name: "save-reload",
                display: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.RELOAD_BUTTON.LABEL),
                color: "primary",
                onClick: () => {
                    saveData();
                    window.location.reload();
                }
            } as Modding.Settings.ButtonConfig
        ]);
    }

    /**
     * Change color of save button from primary to danger
     */
    private static setButtonToReload(): void {
        const btn = document.getElementById(`${Constants.MOD_NAMESPACE}:save-reload`);
        if (btn && btn.classList.contains("btn-primary")) {
            btn.classList.replace("btn-primary", "btn-danger");
        }
    }

    /**
     * Whether the area is configured as enabled
     * @param ctx
     * @param option
     * @returns
     */
    public static isAreaEnabled(ctx: Modding.ModContext, option: DisplayAreaOption) {
        const areas = ctx.settings
            .section(getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECTIONS.DISPLAY_AREA_OPTIONS))
            .get('display-area-options-selected') as DisplayAreaOption[] ?? [];

        return areas.some(a => a === option);
    }
}