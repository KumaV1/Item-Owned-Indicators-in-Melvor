/**
 * Helper for adjustments/builds around township ui
 */

export class TownshipUiHelper {
    public static createConversionTooltipInfo(prefix: string, qty: number): string {
        if (qty < 1) {
            return '';
        }

        return `<br><small class="text-warning">${prefix}: <span class="text-white">${numberWithCommas(qty)}</span></small>`;
    }
}