/**
 * Returns the number of days remaining in the current month, including today.
 */
export function getDaysRemainingInMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Day 0 of the *next* month is the last day of the *current* month.
    const lastDayOfCurrentMonth = new Date(year, month + 1, 0);

    // +1 because if today is the last day, you still have 1 day remaining (today).
    const daysRemaining = lastDayOfCurrentMonth.getDate() - today.getDate() + 1;
    return daysRemaining;
}

/**
 * Checks if a given date string/object represents today.
 */
export function isToday(dateInput) {
    const d = new Date(dateInput);
    const today = new Date();
    return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
    );
}

/**
 * Checks if a given date is within the current active month.
 */
export function isCurrentMonth(dateInput) {
    const d = new Date(dateInput);
    const today = new Date();
    return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth()
    );
}

/**
 * Calculates the exact daily allowance allowed.
 */
export function calculateDailyAllowance(budgetRemaining, daysRemaining) {
    if (daysRemaining <= 0) return budgetRemaining > 0 ? budgetRemaining : 0;
    return Math.max(0, budgetRemaining / daysRemaining);
}
