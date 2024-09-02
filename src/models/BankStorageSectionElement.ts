import { Constants } from "../Constants";
import { BankUiHelper } from "../helpers/BankUiHelper";
import { ItemStorages } from "./ItemStorages";
import { ItemStoragesCreationPerformanceConfig } from "./ItemStoragesCreationPerformanceConfig";

/** Represents the element injected into the BankSelectedItemMenu, to display the various containers */
export class BankStorageSectionElement {
    private _parent: HTMLElement;

    private _sectionContainer: HTMLElement;

    private _storageInfo: HTMLElement;

    /**
     * Initializes empty container for bank storage section
     * @param parent
     */
    constructor(parent: HTMLElement) {
        this._parent = parent;
        this._sectionContainer = createElement('div', {
            id: 'item-owned-indicators__bank-ui-storages-section',
            classList: ['d-none', 'col-12', 'item-owned-indicators__bank-ui-storages-section'],
            parent: parent
        });

        const storageInfoWrapper = createElement('div', {
            classList: ['block', 'block-rounded-double', 'bg-combat-inner-dark'],
            parent: this._sectionContainer
        });
        let storageInfoHeader = createElement('div', {
            classList: ['block-header', 'block-header-default', 'bg-combat-inner-dark'],
            parent: storageInfoWrapper
        });
        storageInfoHeader.innerHTML = `<h5 class="font-size-sm font-w600 mb-0">${getLangString(`${Constants.MOD_NAMESPACE}_Bank_Selected_Item_Section_Title`)}</h5>`;

        this._storageInfo = createElement('div', {
            classList: ['col-12'],
            parent: storageInfoWrapper
        });
    }

    public setItem(item: AnyItem) {
        // Set up config for performance
        let config = new ItemStoragesCreationPerformanceConfig();
        config.disableBank = true;

        // Get storages
        const storages = new ItemStorages(item);
        if (this.showSection(storages)) {
            // Set content
            this._storageInfo.innerHTML = this.buildStoragesInfo(storages);

            // Show container
            showElement(this._sectionContainer);
        } else {
            hideElement(this._sectionContainer);
        }
    }

    /**
     * Whether or not the section should be displayed
     * @param storages
     * @returns
     */
    private showSection(storages: ItemStorages) {
        return storages.equipment > 0
            || storages.cookingStockpiles > 0
            || storages.lootContainer > 0;
    }

    /**
     * Build html for the storage informations inside the section
     * @param storages info about all (relevant) storages
     * @returns
     */
    private buildStoragesInfo(storages: ItemStorages): string {
        return this.buildStorageInfo(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.EQUIPMENT), storages.equipment)
            + this.buildStorageInfo(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COOKING_STOCKPILES), storages.cookingStockpiles)
            + this.buildStorageInfo(getLangString(Constants.TRANSLATION_KEYS.CONTAINERS.COMBAT_LOOT_CONTAINER), storages.lootContainer)
    }

    /**
     * Build html for a specific storage inside the section
     * @param name name of the storage
     * @param qty quantity in the storage
     */
    private buildStorageInfo(name: string, qty: number): string {
        if (qty === 0) {
            return '';
        }

        return `<div class="mt-2 mb-2">
          <span class="mr-1 item-owned-indicators__bank-ui-storages-section-storage-name">${name}:</span><span class="class="item-owned-indicators__bank-ui-storages-section-storage-amount">${formatNumber(qty)}<span></span>
        </div>`
    }
}