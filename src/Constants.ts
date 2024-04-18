export class Constants {
    static readonly MOD_NAMESPACE = "itemOwnedIndicators";

    static readonly TRANSLATION_KEYS = {
        DISPLAY_AREA_OPTIONS: {
            BANK_ITEM_HOVER: '',
            BANK_ITEM_SELECTED: '',
            COMBAT_LOOT_CONTAINER: '',
            COOKING_STOCKPILES: '',
            TOWNSHIP_TRADER_CONVERSION: ''
        },

        CONTAINERS: {
            BANK: 'PAGE_NAME_Bank',
            EQUIPMENT: 'COMBAT_MISC_110',
            COOKING_STOCKPILES: 'SKILL_NAME_Cooking',
            COMBAT_LOOT_CONTAINER: `${Constants.MOD_NAMESPACE}_Storage_Name_Combat_Loot`
        },

        SETTINGS: {
            SECTIONS: {
                GENERAL: ''
            },
            CONFIGS: {
                DISPLAY_AREA_OPTIONS_SELECTED: {
                    LABEL: ''
                },
                RELOAD_BUTTON: {
                    RELOAD_REQUIRED_TEXT: ''
                }
            }
        }
    }
}