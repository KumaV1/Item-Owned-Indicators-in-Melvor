import { Constants } from "../Constants";
import { BankStorageSectionElement } from "../models/BankStorageSectionElement";
import { ItemStorages } from "../models/ItemStorages";
import { ItemStoragesCreationPerformanceConfig } from "../models/ItemStoragesCreationPerformanceConfig";
import { IoiUtils } from "../utils";

/**
 * Helper for adjustments of the bank's ui
 */
export class BankUiHelper {
    private static _sectionElement: BankStorageSectionElement | undefined;

    /**
     * Process rendering the storages section in the bank's selected item info
     * @param item the item to render
     * @param parentContainer the parent under which to place our section, when initially initializing
     * @returns
     */
    public static render(item: AnyItem, parentContainer: HTMLDivElement): void {
        // Initialize / Preserve containers, if they haven't been already
        if (BankUiHelper._sectionElement === undefined) {
            BankUiHelper._sectionElement = new BankStorageSectionElement(parentContainer);
            BankUiHelper._sectionElement.setItem(item);
        }
    }

    /**
     * If necessary, re-renders the selected item container, so it's updated with newest changes
     * @returns
     */
    public static rerenderSelectedItemSidebarContainerIfRequired(): void {
        // No item currently selected
        if (!game.bank.selectedBankItem) {
            return;
        }

        // Not shown, so would update on show anyway (due to mod's method patches)
        if (IoiUtils.elementIsHidden(bankSideBarMenu.selectedMenu.selectedItemContainer)) {
            return;
        }

        // Otherwise, rerender
        this._sectionElement?.setItem(game.bank.selectedBankItem.item);
        return;
    }
}