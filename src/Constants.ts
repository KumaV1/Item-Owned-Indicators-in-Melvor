export class Constants {
    static readonly MOD_NAMESPACE = "itemOwnedIndicators";

    static readonly TRANSLATION_KEYS = {
        DISPLAY_AREA_OPTIONS: {
            BANK_ITEM_HOVER: `${Constants.MOD_NAMESPACE}_Display_Area_Option_BankItemHover`,
            BANK_ITEM_SELECTED: `${Constants.MOD_NAMESPACE}_Display_Area_Option_BankItemSelected`,
            COMBAT_LOOT_CONTAINER: `${Constants.MOD_NAMESPACE}_Display_Area_Option_CombatLootContainer`,
            COOKING_STOCKPILES: `${Constants.MOD_NAMESPACE}_Display_Area_Option_CookingStockpiles`,
            TOWNSHIP_TRADER_CONVERSION: `${Constants.MOD_NAMESPACE}_Display_Area_Option_TownshipTraderConversion`
        },

        CONTAINERS: {
            BANK: 'PAGE_NAME_Bank',
            EQUIPMENT: 'COMBAT_MISC_110',
            COOKING_STOCKPILES: 'SKILL_NAME_Cooking',
            COMBAT_LOOT_CONTAINER: `${Constants.MOD_NAMESPACE}_Storage_Name_Combat_Loot`
        },

        SETTINGS: {
            SECTIONS: {
                DISPLAY_AREA_OPTIONS: `${Constants.MOD_NAMESPACE}_Settings_Setting_Display_Area_Options_Selected_Label`,
                SAVE_AND_RELOAD: `${Constants.MOD_NAMESPACE}_Settings_Setting_Display_Save_Reload`,
            },
            CONFIGS: {
                DISPLAY_AREA_OPTIONS_SELECTED: {
                    LABEL: `${Constants.MOD_NAMESPACE}_Settings_Setting_Display_Area_Options_Selected_Label`
                },
                RELOAD_BUTTON: {
                    LABEL: `${Constants.MOD_NAMESPACE}_Settings_Setting_Display_Save_Reload`
                },
                RELOAD_HINT: `${Constants.MOD_NAMESPACE}_Settings_Hint_Save_Reload_Required`
            }
        }
    }
}