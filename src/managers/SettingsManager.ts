import { Constants } from "../Constants";
import { DisplayAreaOption } from "../models/DisplayAreaOption";

export class SettingsManager {
    public static init(ctx: Modding.ModContext) {
        // Select areas to display info
        ctx.settings.section('SECTION_NAME').add([
            {
                type: 'checkbox-group',
                name: 'display-area-options-selected',
                label: 'MY_LABEL',
                options: [
                    {
                        value: DisplayAreaOption.BankItemHover,
                        label: 'Bank item hover'//getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.BANK_ITEM_HOVER)
                    },
                    {
                        value: DisplayAreaOption.BankItemSelected,
                        label: 'Bank item selected'//getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.BANK_ITEM_SELECTED)
                    },
                    {
                        value: DisplayAreaOption.CombatLootContainer,
                        label: 'Combat loot container'//getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.COMBAT_LOOT_CONTAINER)
                    },
                    {
                        value: DisplayAreaOption.CookingStockpiles,
                        label: 'Cooking stockpiles'//getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.COOKING_STOCKPILES)
                    },
                    {
                        value: DisplayAreaOption.TownshipTraderConversion,
                        label: 'Township trader conversions'//getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.TOWNSHIP_TRADER_CONVERSION)
                    }
                ],
                //default: [
                    //DisplayAreaOption.BankItemHover,
                    //DisplayAreaOption.BankItemSelected,
                    //DisplayAreaOption.CombatLootContainer,
                    //DisplayAreaOption.CookingStockpiles,
                    //DisplayAreaOption.TownshipTraderConversion
                //],
                onChange(value: string, previousValue: string): void {
                    SettingsManager.setButtonToReload();

                    //const hint = document.querySelector(`label[for="${Constants.MOD_NAMESPACE}:display-area-options-selected"] > small`);
                    const label = <HTMLElement>document.querySelector(`label[for="${Constants.MOD_NAMESPACE}:display-area-options-selected"]`);
                    if (!label) {
                        return;
                    }

                    let hint = label?.querySelector(`small`);
                    if (!hint) {
                        createElement('span', { classList: ['ms__force-wrap'], parent: label })
                        hint = createElement('small', { classList: ['d-block'], parent: label });
                    }

                    hint.textContent = getLangString(`${Constants.MOD_NAMESPACE}_Settings_Hint_Save_Reload_Required`);
                    hint.classList.add("text-warning");
                }
            } as Modding.Settings.CheckboxGroupConfig,
        ]);

        // Force reload, as method patching will be done based on settings
        ctx.settings.section('SECTION_NAME_2').add([
            {
                type: "button",
                name: "save-reload",
                display: 'Reload required',//getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.RELOAD_BUTTON.RELOAD_REQUIRED_TEXT),
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
            .section('SECTION_NAME')
            .get('display-area-options-selected') as DisplayAreaOption[] ?? [];

        return areas.some(a => a === option);
    }
}