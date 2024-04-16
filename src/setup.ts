import '../assets/itemOwnedIndicators/Logo.png'
import { BankUiHelper } from './helpers/BankUiHelper';
import { Constants } from './Constants';
import { ItemStorages } from './models/ItemStorages';
import { ItemStoragesCreationPerformanceConfig } from './models/ItemStoragesCreationPerformanceConfig';
import { TranslationManager } from './managers/TranslationManager';
import { UiHelper } from './helpers/UiHelper';

export async function setup(ctx: Modding.ModContext) {
    initTranslations();
    patchBankUi(ctx);
    patchCookingUi(ctx);
    patchCombatLootUi(ctx);
    patchRenderIndicators(ctx);
}

/**
 * Initialize custom translations
 */
function initTranslations() {
    TranslationManager.register();
}

function patchBankUi(ctx: Modding.ModContext) {
    ctx.patch(BankSelectedItemMenu, 'setItem').after(function (returnValue: void, bankItem: BankItem, bank: Bank) {
        BankUiHelper.render(bankItem.item, this.selectedItemContainer);
    });

    ctx.patch(BankItemIcon, 'setItem').after(function (returnValue: void, bank: Bank, bankItem: BankItem) {
        const oldFunc = this.tooltip.props.onShow;
        this.tooltip.props.onShow = (instance: TippyTooltip) => {
            if (this.item !== undefined) {
                // Run originally defined logic first
                oldFunc(instance);

                // Set up config for performance
                let config = new ItemStoragesCreationPerformanceConfig();
                config.disableBank = true;

                // Get storages
                var storages = new ItemStorages(this.item, config);

                // Build and set
                const additionalContent =
                    UiHelper.createBadge(getLangString('COMBAT_MISC_110'), storages.equipment)
                    + UiHelper.createBadge(getLangString('SKILL_NAME_Cooking'), storages.cookingStockpiles)
                    + UiHelper.createBadge(getLangString(`${Constants.MOD_NAMESPACE}_Storage_Name_Combat_Loot`), storages.lootContainer);

                instance.setContent(additionalContent + instance.props.content);
            }
        }
    });
}

function patchCookingUi(ctx: Modding.ModContext) {
    ctx.patch(CookingStockpileIcon, 'getTooltipContent').after(function (returnValue: string): string {
        if (this.item === undefined) {
            return returnValue;
        }

        // Get storages
        var storages = new ItemStorages(this.item);

        return UiHelper.createBadge(getLangString('PAGE_NAME_Bank'), storages.bank)
                + UiHelper.createBadge(getLangString('COMBAT_MISC_110'), storages.equipment)
                + UiHelper.createBadge(getLangString(`${Constants.MOD_NAMESPACE}_Storage_Name_Combat_Loot`), storages.lootContainer)
                + returnValue;
    });
}

/**
 * Patch build of item tooltip, to include indicators of how many you own
 */
function patchCombatLootUi(ctx: Modding.ModContext) {
    ctx.patch(CombatLootMenuElement, 'renderDrops').after(function (returnValue: void, drops: AnyItemQuantity[], maxDrops: number, loot: CombatLoot) {
        // Go through each loot element just created, and prefix tooltip content with more info
        this.dropElements.forEach((dropElement, i) => {
            const drop = drops[i];

            // Set up config for performance
            let config = new ItemStoragesCreationPerformanceConfig();
            config.disableLootContainer = true;

            // Get storages
            var storages = new ItemStorages(drop.item, config);

            // Build and set
            const additionalContent =
                UiHelper.createBadge(getLangString('PAGE_NAME_Bank'), storages.bank)
                + UiHelper.createBadge(getLangString('COMBAT_MISC_110'), storages.equipment)
                + UiHelper.createBadge(getLangString('SKILL_NAME_Cooking'), storages.cookingStockpiles);

            dropElement.tooltip.setContent(additionalContent + dropElement.tooltip.props.content);
        });
    });
}

/**
 * Patch some methods that causes item storages to change,
 * but may not cause the loot container to re-render
 */
function patchRenderIndicators(ctx: Modding.ModContext) {
    // On adding/removing items from the bank in any way
    ctx.patch(Bank, 'addItem').after(function () {
        ensureRerenders();
    });
    ctx.patch(Bank, 'removeItemQuantity').after(function () {
        ensureRerenders();
    });

    // On any changes to equipment/food (some would technically be handled by Bank changes, but better be safe than sorry)
    ctx.patch(Equipment, 'equipItem').after(function () {
        ensureRerenders();
    });
    ctx.patch(Equipment, 'unequipItem').after(function () {
        ensureRerenders();
    });

    ctx.patch(EquippedFood, 'equip').after(function () {
        ensureRerenders();
    });
    ctx.patch(EquippedFood, 'unequipSelected').after(function () {
        ensureRerenders();
    });
    ctx.patch(EquippedFood, 'consume').after(function () {
        ensureRerenders();
    });

    // On passive cooking action (claiming stockpile adds to bank and is therefore already handled by above patch)
    ctx.patch(Cooking, 'passiveCookingAction').after(function () {
        ensureRerenders();
    });
}

/**
 * Goes through all indicators, to make sure that re-renders are made, if necessary
 */
function ensureRerenders() {
    game.combat.loot.renderRequired = true;
    BankUiHelper.rerenderSelectedItemContainerIfRequired();
}