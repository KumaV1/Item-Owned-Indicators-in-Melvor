/**
 * A collection of quantities across the varies item stores in the game
 */
export class ItemStoreQuantities {
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

    //private _lootContainer: number;
    //public get lootContainer(): number {
    //    return this._lootContainer;
    //}

    constructor(item: AnyItem) {
        this._bank = 0;
        this._equipment = 0;
        this._cookingStockpiles = 0;
        //this._lootContainer = 0;
        if (!item) {
            return;
        }

        this._bank = game.bank.getQty(item);

        if (item instanceof EquipmentItem) {
            game.combat.player.equipmentSets.forEach((set) => {
                this._equipment += set.equipment.getQuantityOfItem(item);
            });
        }

        if (item instanceof FoodItem) {
            game.combat.player.food.slots.forEach((slot) => {
                if (slot.item.id === item.id) {
                    this._equipment += slot.quantity;
                }
            });

            game.cooking.stockpileItems.forEach((stockpile) => {
                if (stockpile.item.id === item.id) {
                    this._cookingStockpiles += stockpile.quantity;
                }
            });
        }

        //game.combat.loot.drops.forEach((drop) => {
        //    if (drop.item.id === item.id) {
        //        this._lootContainer += drop.quantity;
		//	}
        //});
	}
}