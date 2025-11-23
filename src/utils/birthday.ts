/**
 * Verifica si hoy es el cumpleaños del usuario
 * @param fechaCumpleanos - Fecha de cumpleaños en formato string o Date
 * @returns true si hoy es el cumpleaños, false en caso contrario
 */

export function isBirthday(fechaCumpleanos: string | Date | null | undefined): boolean {
    if (!fechaCumpleanos) return false;

    const today = new Date();
    let birthdayMonth: number;
    let birthdayDay: number;

    if (typeof fechaCumpleanos === 'string') {
        // Asumimos formato YYYY-MM-DD que viene de Supabase
        // Dividimos el string para evitar problemas de zona horaria (UTC vs Local)
        const parts = fechaCumpleanos.split('-');
        if (parts.length === 3) {
            // Mes es 0-indexed en JS (0 = Enero, 11 = Diciembre)
            birthdayMonth = parseInt(parts[1], 10) - 1;
            birthdayDay = parseInt(parts[2], 10);
        } else {
            // Fallback por si el formato no es el esperado
            const d = new Date(fechaCumpleanos);
            birthdayMonth = d.getUTCMonth();
            birthdayDay = d.getUTCDate();
        }
    } else {
        const d = new Date(fechaCumpleanos);
        birthdayMonth = d.getMonth();
        birthdayDay = d.getDate();
    }

    // Comparar solo mes y día
    return today.getMonth() === birthdayMonth
        && today.getDate() === birthdayDay;
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
