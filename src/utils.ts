export class IoiUtils {
    /**
     * Checks whether the given element is hidden
     * @param element
     * @returns
     */
    public static elementIsHidden(element: Element): boolean {
        return element.classList.contains('d-none');

    }

    /**
     * Checks whether the given element is shown
     * @param element
     * @returns
     */
    public static elementIsShown(element: Element): boolean {
        return !element.classList.contains('d-none');
    }

    public static setCustomElementHeight(element: HTMLElement, height: number): void {
        element.style.setProperty('height', `${height}px`);
    }

    public static removeCustomElementHeight(element: HTMLElement) {
        element.style.removeProperty('height');
    }
}