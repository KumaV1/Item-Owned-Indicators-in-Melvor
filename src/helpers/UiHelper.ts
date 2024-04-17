/**
 * Helper for general ui adjustments/builds
 */
export class UiHelper {
    public static createBadge(prefix: string, qty: number): string {
        if (qty < 1) {
            return '';
        }

        return `<div class="text-center">
            <span class="badge badge-pill m-1 badge-success">${prefix}: ${formatNumber(qty)}</span>
        </div>`;
    }
}