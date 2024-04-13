/** Each context can disable data they don't need, to prevent them from loading */
export class ItemStoragesCreationPerformanceConfig {
    public disableBank: boolean = false;

    public disableEquipment: boolean = false;

    public disableCookingStockpile: boolean = false;

    public disableLootContainer: boolean = false;
}