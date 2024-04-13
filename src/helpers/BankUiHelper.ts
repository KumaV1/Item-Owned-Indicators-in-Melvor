import { Constants } from "../Constants";
import { ItemStorages } from "../models/ItemStorages";
import { ItemStoragesCreationPerformanceConfig } from "../models/ItemStoragesCreationPerformanceConfig";
import { IoiUtils } from "../utils";

/**
 * Helper for adjustments of the bank's ui
 */
export class BankUiHelper {
    /** A container around the selected item sidebar area, whose height we may have to manipulate */
    private static _bankItemBoxContainer: HTMLElement | null;

    /** The container with the information about storages */
    private static _storagesSectionContainer: HTMLDivElement | undefined;

    /**
     * Process rendering the storages section in the bank's selected item info
     * @param item the item to render
     * @param parentContainer the parent under which to place our section, when initially initializing
     * @returns
     */
    public static render(item: AnyItem, parentContainer: HTMLDivElement): void {
        // Set id on container, if it wasn't already
        if (BankUiHelper._storagesSectionContainer === undefined) {
            // Create element
            BankUiHelper._storagesSectionContainer = createElement('div', {
                id: 'item-owned-indicators__bank-ui-storages-section',
                classList: ['col-12', 'item-owned-indicators__bank-ui-storages-section'],
                parent: parentContainer
            });
        }
        if (!BankUiHelper._bankItemBoxContainer) {
            BankUiHelper._bankItemBoxContainer = document.getElementById('bank-item-box');
        }

        BankUiHelper.renderInternal(item);
    }

    /**
     * Process rendering the storages section in the bank's selected item info
     * @param item the item to render
     * @returns
     */
    private static renderInternal(item: AnyItem): void {
        if (!BankUiHelper._storagesSectionContainer) {
            return;
        }

        // Set up config for performance
        let config = new ItemStoragesCreationPerformanceConfig();
        config.disableBank = true;

        // Get storages
        const storages = new ItemStorages(item);

        // Run how to render container
        if (BankUiHelper.showSection(storages)) {
            // Set content of container
            BankUiHelper._storagesSectionContainer.innerHTML = `<div class="block block-rounded-double bg-combat-inner-dark">
                       <div class="block-header block-header-default bg-dark-bank-block-header px-3 py-1">
                           <h5 class="font-size-sm font-w600 mb-0">${getLangString(`${Constants.MOD_NAMESPACE}_Bank_Selected_Item_Section_Title`)}</h5>
                       </div>
                       <div class="col-12">
                           ${BankUiHelper.buildStoragesInfo(storages)}
                       </div>
                   </div>`;

            // Show container
            showElement(BankUiHelper._storagesSectionContainer);
        } else {
            hideElement(BankUiHelper._storagesSectionContainer);
        }

        BankUiHelper.evaluateCustomElementHeights();
    }

    /**
     * Adjust static heights if necessary
     */
    private static evaluateCustomElementHeights(): void {
        if (BankUiHelper._bankItemBoxContainer) {
            IoiUtils.removeCustomElementHeight(BankUiHelper._bankItemBoxContainer);

            if (BankUiHelper._bankItemBoxContainer.offsetHeight < bankSideBarMenu.offsetHeight) {
                IoiUtils.setCustomElementHeight(BankUiHelper._bankItemBoxContainer, bankSideBarMenu.offsetHeight);
            }
        }
    }

    /**
     * If necessary, re-renders the selected item container, so it's updated with newest changes
     * @returns
     */
    public static rerenderSelectedItemContainerIfRequired(): void {
        // No item currently selected
        if (!game.bank.selectedBankItem) {
            return;
        }

        // Not shown, so would update on show anyway (due to patches)
        if (IoiUtils.elementIsHidden(bankSideBarMenu.selectedMenu.selectedItemContainer)) {
            return;
        }

        // Otherwise, rerender
        // NOTE: only calling`renderInternal`(only rerendering the new container) resulted in certain height changes not being picked up properly by what the method currently does
        bankSideBarMenu.selectedMenu.setItem(game.bank.selectedBankItem, game.bank);
        return;
    }

    /**
     * Whether or not the section should be displayed
     * @param storages
     * @returns
     */
    private static showSection(storages: ItemStorages) {
        return storages.equipment > 0
            || storages.cookingStockpiles > 0
            || storages.lootContainer > 0;
    }

    /**
     * Build html for the storage informations inside the section
     * @param storages info about all (relevant) storages
     * @returns
     */
    private static buildStoragesInfo(storages: ItemStorages) {
        return BankUiHelper.buildStorageInfo(getLangString('COMBAT_MISC_110'), storages.equipment)
            + BankUiHelper.buildStorageInfo(getLangString('SKILL_NAME_Cooking'), storages.cookingStockpiles)
            + BankUiHelper.buildStorageInfo(getLangString(`${Constants.MOD_NAMESPACE}_General_Loot`), storages.lootContainer);
    }

    /**
     * Build html for a specific storage inside the section
     * @param name name of the storage
     * @param qty quantity in the storage
     */
    private static buildStorageInfo(name: string, qty: number): string {
        if (qty === 0) {
            return '';
        }

        return `<div class="mt-2 mb-2">
          <span class="mr-1 item-owned-indicators__bank-ui-storages-section-storage-name">${name}:</span><span class="class="item-owned-indicators__bank-ui-storages-section-storage-amount">${formatNumber(qty)}<span></span>
        </div>`
    }
}