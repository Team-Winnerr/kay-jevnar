/**
 * Helper to reliably extract the price in Indian Rupees (INR) for any menu item.
 * Handles USD scale (e.g. 2.5 -> ₹208), old INR scale (e.g. 70 -> ₹70), and priceINR (e.g. 199 -> ₹199).
 */
export const getItemPriceINR = (item: { price: number; priceINR?: number }): number => {
  if (typeof item.priceINR === 'number' && item.priceINR > 0) {
    return item.priceINR;
  }
  if (!item.price || isNaN(item.price)) {
    return 99;
  }
  // If price was saved in INR scale (e.g., 50 to 1000)
  if (item.price >= 30) {
    return Math.round(item.price);
  }
  // If price was saved in USD scale (e.g., 1.5 to 15.0)
  return Math.round(item.price * 83);
};
