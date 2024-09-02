//import { Constants } from "./Constants";
//import { DisplayAreaOption } from "./models/DisplayAreaOption";


//export class SettingsManager {
//    public static init(ctx: Modding.ModContext) {
//        // Select areas to display info
//        ctx.settings.section(getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECTIONS.DISPLAY_OPTIONS)).add([
//            {
//                type: 'checkbox-group',
//                name: 'display-area-options-selected',
//                label: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.DISPLAY_AREA_OPTIONS_SELECTED.LABEL),
//                options: [
//                    {
//                        value: DisplayAreaOption.BankItemHover,
//                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.BANK_ITEM_HOVER)
//                    },
//                    {
//                        value: DisplayAreaOption.BankItemSelected,
//                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.BANK_ITEM_SELECTED)
//                    },
//                    {
//                        value: DisplayAreaOption.CombatLootContainer,
//                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.COMBAT_LOOT_CONTAINER)
//                    },
//                    {
//                        value: DisplayAreaOption.CookingStockpiles,
//                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.COOKING_STOCKPILES)
//                    },
//                    {
//                        value: DisplayAreaOption.TownshipTraderConversions,
//                        label: getLangString(Constants.TRANSLATION_KEYS.DISPLAY_AREA_OPTIONS.TOWNSHIP_TRADER_CONVERSION)
//                    }
//                ],
//                default: [
//                    DisplayAreaOption.BankItemHover,
//                    DisplayAreaOption.BankItemSelected,
//                    DisplayAreaOption.CombatLootContainer,
//                    DisplayAreaOption.CookingStockpiles,
//                    DisplayAreaOption.TownshipTraderConversions
//                ],
//                onChange(value: string, previousValue: string): void {
//                    SettingsManager.setButtonToReload();

//                    const label = <HTMLElement>document.querySelector(`label[for="${Constants.MOD_NAMESPACE}:display-area-options-selected"]`);
//                    if (!label) {
//                        return;
//                    }

//                    let hint = label?.querySelector(`small`);
//                    if (!hint) {
//                        createElement('span', { classList: ['ms__force-wrap'], parent: label })
//                        hint = createElement('small', { classList: ['d-block'], parent: label });
//                    }

//                    hint.textContent = getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.RELOAD_HINT);
//                    hint.classList.add("text-warning");
//                }
//            } as Modding.Settings.CheckboxGroupConfig,
//            {
//                type: 'dropdown',
//                name: 'container-display-behaviour',
//                label: 'Container display behaviour',
//                hint: 'The current container is always hidden, regardless of this setting. For example, in the bank you will not be shown how many of the item you have in the bank',
//                options: [
//                    {
//                        value: 'val1',
//                        display: 'Show only containers that contain the item'
//                    },
//                    {
//                        value: 'val2',
//                        display: 'Show all containers, if at least one of them contains the item'
//                    },
//                    {
//                        value: 'val3',
//                        display: 'Always show all containers'
//                    }
//                ],
//                default: 'val1'
//                //hint: 'Basically means all containers are shown (still, only when at least one has entries? This should probably become a dropdown because of that). Also, badges of empty containers are gonna be orange, aka text-warning'
//                // TODO: Add setting to allow storages without content to be displayed (as 0 or Not Owned)
//            } as Modding.Settings.DropdownConfig,
//            {
//                type: 'dropdown',
//                name: 'display-type',
//                label: 'Text display format',
//                options: [
//                    {
//                        value: 'val1',
//                        display: 'Name: Number'
//                    },
//                    {
//                        value: 'val2',
//                        display: 'Icon: Number'
//                    },
//                    {
//                        value: 'val3',
//                        display: 'Name: (Not) Owned'
//                    },
//                    {
//                        value: 'val4',
//                        display: 'Icon: (Not) Owned'
//                    },
//                ],
//                default: 'val1'
//            } as Modding.Settings.DropdownConfig
//            //{
//            //    type: 'checkbox-group',
//            //    name: 'show-additional-info',
//            //    label: 'Show additional container info',
//            //    options: [
//            //        {
//            //            value: 'val1',
//            //            label: ''
//            //        },
//            //        {
//            //            value: 'val2',
//            //            label: ''
//            //        }
//            //    ]
//            //    // TODO: Add settings to enable additional info for certain storages (bank tab + index in tab for bank, exact equipment preset(s) in which item was found)
//            //} as Modding.Settings.CheckboxGroupConfig,

//        ]);

//        ctx.settings.section('Info Options').add([
//            {
//                type: 'dropdown',
//                name: 'show-bank-tab-lcoation',
//                label: 'Show bank tab location',
//                options: [
//                    {
//                        value: 'val1',
//                        display: 'Disabled'
//                    },
//                    {
//                        value: 'val2',
//                        display: 'Tab - for example "(5)"'
//                    },
//                    {
//                        value: 'val3',
//                        display: 'Tab and index - for example "(5, 30)"'
//                    },
//                ],
//                default: 'val1'
//                // TODO: Add setting to allow storages without content to be displayed (as 0 or Not Owned)
//            } as Modding.Settings.DropdownConfig,
//            {
//                type: 'switch',
//                name: 'show-equipment-presets',
//                label: 'Show equipment preset location(s) - for example "(2)" or "(1, 3, 4)"'
//            } as Modding.Settings.SwitchConfig
//        ]);

//        // Force reload, as method patching will be done based on settings
//        ctx.settings.section(getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECTIONS.SAVE_AND_RELOAD)).add([
//            {
//                type: "button",
//                name: "save-reload",
//                display: getLangString(Constants.TRANSLATION_KEYS.SETTINGS.CONFIGS.RELOAD_BUTTON.LABEL),
//                color: "primary",
//                onClick: () => {
//                    saveData();
//                    window.location.reload();
//                }
//            } as Modding.Settings.ButtonConfig
//        ]);
//    }

//    /**
//     * Change color of save button from primary to danger
//     */
//    private static setButtonToReload(): void {
//        const btn = document.getElementById(`${Constants.MOD_NAMESPACE}:save-reload`);
//        if (btn && btn.classList.contains("btn-primary")) {
//            btn.classList.replace("btn-primary", "btn-danger");
//        }
//    }

//    /**
//     * Whether the area is configured as enabled
//     * @param ctx
//     * @param option
//     * @returns
//     */
//    public static isAreaEnabled(ctx: Modding.ModContext, option: DisplayAreaOption) {
//        const areas = ctx.settings
//            .section(getLangString(Constants.TRANSLATION_KEYS.SETTINGS.SECTIONS.DISPLAY_OPTIONS))
//            .get('display-area-options-selected') as DisplayAreaOption[] ?? [];

//        return areas.some(a => a === option);
//    }
//}