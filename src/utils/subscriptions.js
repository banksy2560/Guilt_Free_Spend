/**
 * Utility to identify potential recurring subscriptions from transaction history.
 * 
 * Logic: Looks for transactions with the same 'notes' (Merchant name) 
 * that appear roughly 1 month apart, or appear multiple times across months.
 */
export function detectSubscriptions(transactions) {
    if (!transactions || transactions.length === 0) return [];

    // 1. Group by exact note (case insensitive)
    const groups = {};
    transactions.forEach(tx => {
        if (!tx.notes) return;
        const key = tx.notes.toLowerCase().trim();
        if (!groups[key]) groups[key] = [];
        groups[key].push(tx);
    });

    const subscriptions = [];

    // 2. Analyze frequency
    for (const [merchant, txs] of Object.entries(groups)) {
        if (txs.length < 2) continue; // Need at least 2 to establish a pattern

        // Sort newest to oldest
        txs.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Very basic check: are the amounts identical or very close?
        const avgAmount = txs.reduce((sum, tx) => sum + tx.amount, 0) / txs.length;
        const maxDeviation = Math.max(...txs.map(tx => Math.abs(tx.amount - avgAmount)));

        // If amounts deviate by more than 20%, it's probably just regular shopping (e.g. Uber, Coffee)
        if (maxDeviation > (avgAmount * 0.2)) continue;

        // Calculate average days between charges
        let totalDays = 0;
        let validIntervals = 0;

        for (let i = 0; i < txs.length - 1; i++) {
            const date1 = new Date(txs[i].date);
            const date2 = new Date(txs[i + 1].date);
            const diffTime = Math.abs(date1 - date2);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            totalDays += diffDays;
            validIntervals++;
        }

        const avgDaysBetween = totalDays / validIntervals;

        // If it happens roughly monthly (25-35 days) or weekly (6-8 days)
        if ((avgDaysBetween >= 25 && avgDaysBetween <= 35) || (avgDaysBetween >= 6 && avgDaysBetween <= 8)) {

            // Extrapolate annual cost
            let annualCost = avgAmount * 12; // Assume monthly by default
            if (avgDaysBetween <= 8) annualCost = avgAmount * 52; // Weekly

            const lastCharged = new Date(txs[0].date);
            let nextDue = new Date(lastCharged);
            nextDue.setDate(nextDue.getDate() + Math.round(avgDaysBetween));

            subscriptions.push({
                merchant: txs[0].notes, // Use original casing
                amount: avgAmount,
                frequency: avgDaysBetween <= 8 ? 'Weekly' : 'Monthly',
                annualCost: annualCost,
                lastCharged: lastCharged.toISOString(),
                nextDue: nextDue.toISOString(),
                categoryId: txs[0].categoryId
            });
        }
    }

    // Sort by largest annual drain
    return subscriptions.sort((a, b) => b.annualCost - a.annualCost);
}
