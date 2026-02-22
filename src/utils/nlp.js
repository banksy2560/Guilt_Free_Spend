/**
 * Basic NLP utility to extract transaction amounts and notes from a spoken string.
 *
 * Example inputs:
 * "I spent 12 dollars on coffee" -> { amount: 12, notes: "coffee" }
 * "2450 at the supermarket" -> { amount: 24.50, notes: "supermarket" }
 * "bought a new game for 60 bucks" -> { amount: 60, notes: "new game" }
 */
export function parseSpokenTransaction(transcript) {
    if (!transcript) return null;

    const lower = transcript.toLowerCase().trim();

    // Strategy 1: Look for explicit currency markers
    // e.g. "12 dollars", "60 bucks", "$15.50"
    const amountMatchMarkers = lower.match(/(?:spent\s+)?(\d+(?:\.\d{1,2})?)\s*(dollars|bucks|quid|\$|for)/);

    // Strategy 2: Look for any number if no markers found
    const amountMatchFallback = lower.match(/(\d+(?:\.\d{1,2})?)/);

    let amount = null;
    let matchString = '';

    if (amountMatchMarkers) {
        amount = parseFloat(amountMatchMarkers[1]);
        matchString = amountMatchMarkers[0];
    } else if (amountMatchFallback) {
        amount = parseFloat(amountMatchFallback[1]);
        matchString = amountMatchFallback[0];
    }

    if (isNaN(amount) || amount === null) {
        return null; // Could not find an amount
    }

    // Now try to extract the note by removing the amount and filler words
    let notes = lower
        .replace(matchString, '')
        .replace(/^(i |we )?(just )?(spent|bought|paid|got)/g, '')
        .replace(/^(a |an |some )/g, '')
        .replace(/^(on |for |at |to )/g, '')
        .replace(/(on |for |at |to )$/g, '')
        .trim();

    // If the note is empty, we just return the amount
    return {
        amount: amount,
        notes: notes || ''
    };
}
