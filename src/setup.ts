import '../assets/itemOwnedIndicators/Logo.png'
import { CombatLootUiHelper } from './helpers/CombatLootUiHelper';
import { ItemStoreQuantities } from './models/QuantityData';

export async function setup(ctx: Modding.ModContext) {
    patchTooltilCreation();
    patchCombatLootContainerRenderIndicators(ctx);
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

        var quantities = new ItemStoreQuantities(item);
        return CombatLootUiHelper.createBadge(getLangString('PAGE_NAME_Bank'), quantities.bank)
            + CombatLootUiHelper.createBadge(getLangString('COMBAT_MISC_110'), quantities.equipment)
            + CombatLootUiHelper.createBadge(getLangString('SKILL_NAME_Cooking'), quantities.cookingStockpiles)
            + originalResult;
    }

    window.createItemInformationTooltip = newFunc;
}

/**
 * Patch some methods that causes item stores to change,
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