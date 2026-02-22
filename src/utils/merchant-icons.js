/**
 * Smart Merchant Iconography
 * Maps common transaction keywords to emojis for instant visual recognition.
 */

const MERCHANT_MAP = [
  // Beverages
  { keywords: ['coffee', 'cafe', 'latte', 'cappuccino', 'espresso', 'starbucks', 'barista'], emoji: '☕' },
  { keywords: ['beer', 'brewery', 'pub', 'bar', 'drinks', 'cocktail', 'wine'], emoji: '🍺' },
  { keywords: ['juice', 'smoothie', 'bubble tea', 'boba'], emoji: '🧃' },

  // Food
  { keywords: ['lunch', 'dinner', 'restaurant', 'dining', 'eat', 'meal', 'food court'], emoji: '🍽️' },
  { keywords: ['pizza'], emoji: '🍕' },
  { keywords: ['sushi', 'japanese'], emoji: '🍣' },
  { keywords: ['burger', 'mcdonald', 'fast food', 'kfc', 'hungry jack'], emoji: '🍔' },
  { keywords: ['breakfast', 'brunch', 'eggs', 'toast', 'pancake'], emoji: '🥞' },
  { keywords: ['grocery', 'groceries', 'supermarket', 'woolworths', 'coles', 'aldi'], emoji: '🛒' },
  { keywords: ['snack', 'chips', 'candy', 'chocolate'], emoji: '🍫' },

  // Transport
  { keywords: ['uber', 'lyft', 'taxi', 'cab', 'ride'], emoji: '🚗' },
  { keywords: ['fuel', 'gas', 'petrol', 'diesel', 'shell', 'bp'], emoji: '⛽' },
  { keywords: ['train', 'metro', 'subway', 'opal', 'myki'], emoji: '🚆' },
  { keywords: ['bus'], emoji: '🚌' },
  { keywords: ['flight', 'airline', 'airport', 'travel', 'plane'], emoji: '✈️' },
  { keywords: ['parking'], emoji: '🅿️' },

  // Shopping
  { keywords: ['amazon', 'online', 'delivery', 'package'], emoji: '📦' },
  { keywords: ['clothes', 'clothing', 'shirt', 'fashion', 'shoes', 'sneakers', 'uniqlo', 'zara', 'h&m'], emoji: '👕' },
  { keywords: ['gift', 'present', 'birthday'], emoji: '🎁' },
  { keywords: ['book', 'kindle', 'reading'], emoji: '📚' },

  // Entertainment
  { keywords: ['movie', 'cinema', 'film', 'theatre', 'theater'], emoji: '🎬' },
  { keywords: ['spotify', 'music', 'concert', 'gig'], emoji: '🎵' },
  { keywords: ['netflix', 'streaming', 'disney', 'hulu', 'stan'], emoji: '📺' },
  { keywords: ['game', 'gaming', 'playstation', 'xbox', 'steam', 'nintendo'], emoji: '🎮' },
  { keywords: ['gym', 'fitness', 'workout', 'yoga', 'exercise'], emoji: '💪' },

  // Bills & Services
  { keywords: ['phone', 'mobile', 'telstra', 'optus', 'vodafone'], emoji: '📱' },
  { keywords: ['internet', 'wifi', 'nbn', 'broadband'], emoji: '🌐' },
  { keywords: ['electric', 'electricity', 'power', 'utility', 'utilities'], emoji: '⚡' },
  { keywords: ['rent', 'mortgage', 'lease'], emoji: '🏠' },
  { keywords: ['insurance'], emoji: '🛡️' },
  { keywords: ['doctor', 'medical', 'pharmacy', 'chemist', 'health', 'dentist'], emoji: '💊' },
  { keywords: ['haircut', 'barber', 'salon', 'beauty'], emoji: '💇' },

  // Finance
  { keywords: ['subscription', 'sub', 'monthly', 'annual'], emoji: '🔄' },
  { keywords: ['atm', 'cash', 'withdraw', 'withdrawal'], emoji: '💵' },
  { keywords: ['invest', 'stock', 'shares', 'crypto', 'bitcoin'], emoji: '📈' },

  // Pets
  { keywords: ['pet', 'vet', 'dog', 'cat', 'puppy', 'kitten'], emoji: '🐾' },
];

/**
 * Returns an emoji for a given transaction note string.
 * Returns null if no match is found.
 */
export function getMerchantEmoji(notes) {
  if (!notes) return null;
  const lower = notes.toLowerCase().trim();
  for (const entry of MERCHANT_MAP) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) return entry.emoji;
    }
  }
  return null;
}
