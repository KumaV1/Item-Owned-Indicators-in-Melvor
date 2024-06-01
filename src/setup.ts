import '../assets/itemOwnedIndicators/Logo.png'
import { BankUiHelper } from './helpers/BankUiHelper';
import { Constants } from './Constants';
import { ItemStorages } from './models/ItemStorages';
import { ItemStoragesCreationPerformanceConfig } from './models/ItemStoragesCreationPerformanceConfig';
import { TownshipUiHelper } from './helpers/TownshipUiHelper';
import { TranslationManager } from './managers/TranslationManager';
import { UiHelper } from './helpers/UiHelper';
import { SettingsManager } from './managers/SettingsManager';
import { DisplayAreaOption } from './models/DisplayAreaOption';
import { IoiUtils } from './utils';

export async function setup(ctx: Modding.ModContext) {
    initTranslations();
    initSettings(ctx);

    ctx.onCharacterLoaded(function () {
        if (IoiUtils.buildIncludesIta()) {
            patchBankUi(ctx);
            patchCookingUi(ctx);
        }
        else {
            preItaPatches(ctx);
        }

        patchTownshipUi(ctx);
        patchCombatLootUi(ctx);
        patchRenderIndicators(ctx);
    });
}

/**
 * Initialize custom translations
 */
function initTranslations() {
    TranslationManager.register();
}

/**
 * Initialize settings
 */
function initSettings(ctx: Modding.ModContext) {
    SettingsManager.init(ctx);
}

/**
 * Variants of some of the other patching methods, based on the structure before the "Into the Abyss" expansion release
 * @param ctx
 * @deprecated Once the expansion releases and has been live for some time, this method can be removed
 */
function preItaPatches(ctx: Modding.ModContext) {
    // patchBankUi
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.BankItemSelected)) {
        // @ts-ignore: Old class name
        ctx.patch(BankSelectedItemMenu, 'setItem').after(function (returnValue: void, bankItem: BankItem, bank: Bank) {
            BankUiHelper.render(bankItem.item, this.selectedItemContainer);
        });
    }
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.BankItemHover)) {
        // @ts-ignore: Old class name
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
                    const additionalContent = UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
                        + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COOKING_STOCKPILES), storages.cookingStockpiles)
                        + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COMBAT_LOOT_CONTAINER), storages.lootContainer);

                    instance.setContent(additionalContent + instance.props.content);
                }
            }
        });

        // At this point the bank already rendered, so we have to re-render it for the patched version to be rendered
        game.bank.itemsByTab.forEach((tab: BankItem[], tabID: Number) => {
            tab.forEach((bankItem: BankItem) => {
                // @ts-ignore: Old class name
                const itemIcon: BankItemIcon | undefined = bankTabMenu.itemIcons.get(bankItem.item);
                if (itemIcon !== undefined) {
                    itemIcon.setItem(game.bank, bankItem);
                }
            })
        });
    }

    // patchCookingUi
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.CookingStockpiles)) {
        // @ts-ignore: Old class name
        ctx.patch(CookingStockpileIcon, 'getTooltipContent').after(function (returnValue: string): string {
            if (this.item === undefined) {
                return returnValue;
            }

            // Get storages
            var storages = new ItemStorages(this.item);

            // Build and set
            return UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.BANK), storages.bank)
                + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
                + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COMBAT_LOOT_CONTAINER), storages.lootContainer)
                + returnValue;
        });
    }

    // patchTownshipUi

    // patchCombatLootUi

    // patchRenderIndicators
}

function patchBankUi(ctx: Modding.ModContext) {
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.BankItemSelected)) {
        ctx.patch(BankSelectedItemMenuElement, 'setItem').after(function (returnValue: void, bankItem: BankItem, bank: Bank) {
            BankUiHelper.render(bankItem.item, this.selectedItemContainer);
        });
    }

    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.BankItemHover)) {
        ctx.patch(BankItemIconElement, 'setItem').after(function (returnValue: void, bank: Bank, bankItem: BankItem) {
            // If the game itself doesn't use a tooltip any more, the following logic would break,
            // so just don't do anything anymore in that case
            if (this.tooltip === undefined) {
                return;
            }

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
                    const additionalContent = UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
                        + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COOKING_STOCKPILES), storages.cookingStockpiles)
                        + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COMBAT_LOOT_CONTAINER), storages.lootContainer);

                    instance.setContent(additionalContent + instance.props.content);
                }
            }
        });

        // At this point the bank already rendered, so we have to re-render it for the patched version to be rendered
        game.bank.itemsByTab.forEach((tab: BankItem[], tabID: Number) => {
            tab.forEach((bankItem: BankItem) => {
                const itemIcon: BankItemIconElement | undefined = bankTabMenu.itemIcons.get(bankItem.item);
                if (itemIcon !== undefined) {
                    itemIcon.setItem(game.bank, bankItem);
                }
            })
        });
    }
}

function patchCookingUi(ctx: Modding.ModContext) {
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.CookingStockpiles)) {
        ctx.patch(CookingStockpileIconElement, 'setItem').after(function (returnValue: void, item: AnyItem, quantity: number) {
            if (!this.tooltipElem.textContent) {
                return;
            }

            // Get storages
            var storages = new ItemStorages(item);

            // Build and set
            this.tooltipElem.textContent = UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.BANK), storages.bank)
                + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
                + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COMBAT_LOOT_CONTAINER), storages.lootContainer)
                + this.tooltipElem.textContent;
        });
    }
}

function patchTownshipUi(ctx: Modding.ModContext) {
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.TownshipTraderConversions)) {
        ctx.patch(TownshipConversionElement, 'getTooltip').after(function (returnValue: string, resource: TownshipResource, conversion: TownshipItemConversion): string {
            // Set up config for performance
            let config = new ItemStoragesCreationPerformanceConfig();
            config.disableBank = true; // the original tooltip already takes care of it

            // Get storages
            var storages = new ItemStorages(conversion.item, config);

            // Build and set
            return returnValue
                + TownshipUiHelper.createConversionTooltipInfo(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
                + TownshipUiHelper.createConversionTooltipInfo(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COOKING_STOCKPILES), storages.cookingStockpiles)
                + TownshipUiHelper.createConversionTooltipInfo(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COMBAT_LOOT_CONTAINER), storages.lootContainer);
        });
    }
}

/**
 * Patch build of item tooltip, to include indicators of how many you own
 */
function patchCombatLootUi(ctx: Modding.ModContext) {
    if (SettingsManager.isAreaEnabled(ctx, DisplayAreaOption.CombatLootContainer)) {
        ctx.patch(CombatLootMenuElement, 'renderDrops').after(function (returnValue: void, drops: AnyItemQuantity[], maxDrops: number, loot: CombatLoot) {
            // Go through each loot element just created, and prefix tooltip content with more info
            if (this.dropElements.length < 1) {
                return;
            }

            for (var i = 0; i < this.dropElements.length; i++) {
                const dropElement = this.dropElements[i];
                if (!dropElement) {
                    continue;
                }

                const drop = drops[i];
                if (!drop) {
                    continue;
                }

                // Set up config for performance
                let config = new ItemStoragesCreationPerformanceConfig();
                config.disableLootContainer = true;

                // Get storages
                var storages = new ItemStorages(drop.item, config);

                // Build and set
                const additionalContent =
                    UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.BANK), storages.bank)
                    + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
                    + UiHelper.createBadge(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COOKING_STOCKPILES), storages.cookingStockpiles);

                dropElement.tooltip.setContent(additionalContent + dropElement.tooltip.props.content);
            }
        });

        // May not do anything, if the player loads in on the combat screen?
        game.combat.loot.renderRequired = true;
    }
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