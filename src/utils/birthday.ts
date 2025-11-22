/**
 * Verifica si hoy es el cumpleaños del usuario
 * @param fechaCumpleanos - Fecha de cumpleaños en formato string o Date
 * @returns true si hoy es el cumpleaños, false en caso contrario
 */
export function isBirthday(fechaCumpleanos: string | Date | null | undefined): boolean {
    if (!fechaCumpleanos) return false;

    const today = new Date();
    const birthday = new Date(fechaCumpleanos);

    // Comparar solo mes y día (ignorar año)
    return today.getMonth() === birthday.getMonth()
        && today.getDate() === birthday.getDate();
}

/**
 * Porcentaje de descuento aplicable en cumpleaños (15%)
 */
export const BIRTHDAY_DISCOUNT_PERCENT = 15;

/**
 * Descuento en formato decimal (0.15)
 */
export const BIRTHDAY_DISCOUNT = BIRTHDAY_DISCOUNT_PERCENT / 100;

/**
 * Calcula el precio con descuento de cumpleaños aplicado
 * @param precioOriginal - Precio original
 * @returns Precio con descuento aplicado
 */
export function applyBirthdayDiscount(precioOriginal: number): number {
    return precioOriginal * (1 - BIRTHDAY_DISCOUNT);
}

/**
 * Calcula el monto de descuento
 * @param precioOriginal - Precio original
 * @returns Monto del descuento
 */
export function getBirthdayDiscountAmount(precioOriginal: number): number {
    return precioOriginal * BIRTHDAY_DISCOUNT;
}
