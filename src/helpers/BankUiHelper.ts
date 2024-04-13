import { ItemStorages } from "../models/ItemStorages";
import { ItemStoragesCreationPerformanceConfig } from "../models/ItemStoragesCreationPerformanceConfig";

/**
 * Helper for adjustments of the bank's ui
 */
export class BankUiHelper {
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
            BankUiHelper._storagesSectionContainer = document.createElement("div");
            BankUiHelper._storagesSectionContainer.id = "item-owned-indicators__bank-ui-storages-section";
            BankUiHelper._storagesSectionContainer.classList.add("col-12");
            BankUiHelper._storagesSectionContainer.classList.add("item-owned-indicators__bank-ui-storages-section");

            // Place it b
            parentContainer.appendChild(BankUiHelper._storagesSectionContainer)
        }

        // Set up config for performance
        let config = new ItemStoragesCreationPerformanceConfig();
        config.disableBank = true;

        // Get storages
        const storages = new ItemStorages(item);

        // Run how to render container
        if (!BankUiHelper.showSection(storages)) {
            hideElement(BankUiHelper._storagesSectionContainer);
            return;
        }

        BankUiHelper._storagesSectionContainer.innerHTML = `<div class="block block-rounded-double bg-combat-inner-dark">
                       <div class="block-header block-header-default bg-dark-bank-block-header px-3 py-1">
                           <h5 class="font-size-sm font-w600 mb-0">SECTION TITLE HERE</h5>
                       </div>
                       <div class="col-12">
                           ${BankUiHelper.buildStoragesInfo(storages)}
                       </div>
                   </div>`;
        showElement(BankUiHelper._storagesSectionContainer);
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
            + BankUiHelper.buildStorageInfo("Loot", storages.lootContainer);
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

        return `<div class="mt-2 mb-2 mr-2">
          <span class="item-owned-indicators__bank-ui-storages-section-storage-name">${name}:</span><span class="class="item-owned-indicators__bank-ui-storages-section-storage-amount">${formatNumber(qty)}<span></span>
        </div>`
    }
}