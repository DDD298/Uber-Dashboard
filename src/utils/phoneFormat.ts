/**
 * Format phone number from international format to Vietnamese format
 * @param phone - Phone number in format +84XXXXXXXXX or 0XXXXXXXXX
 * @returns Phone number in format 0XXXXXXXXX
 * 
 * Examples:
 * - "+84977109429" -> "0977109429"
 * - "0977109429" -> "0977109429"
 * - "+84 977 109 429" -> "0977109429"
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  
  // Remove all spaces and special characters except + and digits
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  // If starts with +84, replace with 0
  if (cleaned.startsWith("+84")) {
    return "0" + cleaned.substring(3);
  }
  
  // If starts with 84 (without +), replace with 0
  if (cleaned.startsWith("84") && cleaned.length > 10) {
    return "0" + cleaned.substring(2);
  }
  
  // Already in correct format or other format
  return cleaned;
}

/**
 * Format phone number to international format
 * @param phone - Phone number in format 0XXXXXXXXX or +84XXXXXXXXX
 * @returns Phone number in format +84XXXXXXXXX
 * 
 * Examples:
 * - "0977109429" -> "+84977109429"
 * - "+84977109429" -> "+84977109429"
 */
export function formatPhoneToInternational(phone: string | null | undefined): string {
  if (!phone) return "";
  
  // Remove all spaces and special characters except + and digits
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  // If starts with 0, replace with +84
  if (cleaned.startsWith("0")) {
    return "+84" + cleaned.substring(1);
  }
  
  // If starts with 84 (without +), add +
  if (cleaned.startsWith("84") && !cleaned.startsWith("+")) {
    return "+" + cleaned;
  }
  
  // Already in international format
  return cleaned;
}

/**
 * Format phone number with spacing for better readability
 * @param phone - Phone number
 * @returns Formatted phone with spaces
 * 
 * Examples:
 * - "0977109429" -> "097 710 9429"
 * - "+84977109429" -> "+84 977 109 429"
 */
export function formatPhoneWithSpaces(phone: string | null | undefined): string {
  if (!phone) return "";
  
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  if (cleaned.startsWith("+84")) {
    // Format: +84 XXX XXX XXX
    const number = cleaned.substring(3);
    return `+84 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  } else if (cleaned.startsWith("0")) {
    // Format: 0XX XXX XXXX
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return cleaned;
}
