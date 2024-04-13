import '../assets/itemOwnedIndicators/Logo.png'
import { BankUiHelper } from './helpers/BankUiHelper';
import { CombatLootUiHelper } from './helpers/CombatLootUiHelper';
import { TranslationManager } from './managers/TranslationManager';
import { ItemStorages } from './models/ItemStorages';

export async function setup(ctx: Modding.ModContext) {
    initTranslations();
    patchTooltilCreation();
    patchBankUi(ctx);
    patchCombatLootContainerRenderIndicators(ctx);
}

function patchBankUi(ctx: Modding.ModContext) {
    ctx.patch(BankSelectedItemMenu, 'setItem').after(function (returnValue: void, bankItem: BankItem, bank: Bank) {
        BankUiHelper.render(bankItem.item, this.selectedItemContainer);
    });
}

/**
 * Initialize custom translations
 */
function initTranslations() {
    TranslationManager.register();
}

/**
 * Patch build of item tooltip, to include indicators of how many you own
 */
function patchTooltilCreation() {
    const originalFunc = createItemInformationTooltip;

    const newFunc = function (item: AnyItem, showStats?: boolean | undefined): string {
        const originalResult = originalFunc(item, showStats);

        // Current (?8596) indicator, that we are in the combat loot container
        if (!showStats) {
            return originalResult;
        }

        var storages = new ItemStorages(item);
        return CombatLootUiHelper.createBadge(getLangString('PAGE_NAME_Bank'), storages.bank)
            + CombatLootUiHelper.createBadge(getLangString('COMBAT_MISC_110'), storages.equipment)
            + CombatLootUiHelper.createBadge(getLangString('SKILL_NAME_Cooking'), storages.cookingStockpiles)
            + originalResult;
    }

    window.createItemInformationTooltip = newFunc;
}

/**
 * Patch some methods that causes item storages to change,
 * but may not cause the loot container to re-render
 */
function patchCombatLootContainerRenderIndicators(ctx: Modding.ModContext) {
    // On adding/removing items from the bank in any way
    ctx.patch(Bank, 'addItem').after(function () {
        game.combat.loot.renderRequired = true;
    });
    ctx.patch(Bank, 'removeItemQuantity').after(function () {
        game.combat.loot.renderRequired = true;
    });

    // On any changes to equipment/food (some would technically be handled by Bank changes, but better be safe than sorry)
    ctx.patch(Equipment, 'equipItem').after(function () {
        game.combat.loot.renderRequired = true;
    });
    ctx.patch(Equipment, 'unequipItem').after(function () {
        game.combat.loot.renderRequired = true;
    });

    ctx.patch(EquippedFood, 'equip').after(function () {
        game.combat.loot.renderRequired = true;
    });
    ctx.patch(EquippedFood, 'unequipSelected').after(function () {
        game.combat.loot.renderRequired = true;
    });
    ctx.patch(EquippedFood, 'consume').after(function () {
        game.combat.loot.renderRequired = true;
    });

    // On passive cooking action (claiming stockpile adds to bank and is therefore already handled by above patch)
    ctx.patch(Cooking, 'passiveCookingAction').after(function () {
        game.combat.loot.renderRequired = true;
    });
}