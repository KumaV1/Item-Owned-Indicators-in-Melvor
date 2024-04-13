import { ItemStoragesCreationPerformanceConfig } from "./ItemStoragesCreationPerformanceConfig";

/**
 * A collection of quantities across the varies item storages in the game
 */
export class ItemStorages {
    private _bank: number
    public get bank(): number {
        return this._bank;
    }

    private _equipment: number;
    public get equipment(): number {
        return this._equipment;
    }


    private _cookingStockpiles: number;
    public get cookingStockpiles(): number {
        return this._cookingStockpiles;
    }

    private _lootContainer: number;
    public get lootContainer(): number {
        return this._lootContainer;
    }

    constructor(item: AnyItem, config?: ItemStoragesCreationPerformanceConfig | undefined) {
        // Default values and parameter check
        this._bank = 0;
        this._equipment = 0;
        this._cookingStockpiles = 0;
        this._lootContainer = 0;
        if (!item) {
            return;
        }

        // Initialize unaffecting object, if not defined, to avoid more undefined checks
        if (config === undefined) {
            config = new ItemStoragesCreationPerformanceConfig();
        }

        // Check stores
        if (!config.disableBank) {
            this._bank = game.bank.getQty(item);
        }

        if (item instanceof EquipmentItem && !config.disableEquipment) {
            game.combat.player.equipmentSets.forEach((set) => {
                this._equipment += set.equipment.getQuantityOfItem(item);
            });
        }

        if (item instanceof FoodItem) {
            if (!config.disableEquipment) {
                game.combat.player.food.slots.forEach((slot) => {
                    if (slot.item.id === item.id) {
                        this._equipment += slot.quantity;
                    }
                });
            }

            if (!config.disableCookingStockpile) {
                game.cooking.stockpileItems.forEach((stockpile) => {
                    if (stockpile.item.id === item.id) {
                        this._cookingStockpiles += stockpile.quantity;
                    }
                });
            }
        }

        if (!config.disableLootContainer) {
            game.combat.loot.drops.forEach((drop) => {
                if (drop.item.id === item.id) {
                    this._lootContainer += drop.quantity;
                }
            });
        }
    }
}