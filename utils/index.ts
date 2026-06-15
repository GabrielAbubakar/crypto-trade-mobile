// Export modules from this directory

/**
 *
 * @param phone phone number to format
 * @returns formatted phone number in style of +2348130441123
 */
export function formatPhoneNumber(phone: string) {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  if (!cleaned.startsWith("234")) {
    cleaned = "234" + cleaned;
  }

  return "+" + cleaned;
}

export * from "./toast";

/**
 *
 * @param num number to format
 * @param isCurrency whether to format as currency
 * @param fractionDigits number of decimal places
 * @returns formatted number
 */
export function formatCompact(
  num: number,
  isCurrency = false,
  fractionDigits = 2,
) {
  if (!num) return isCurrency ? "$0" : "0";
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];
  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(fractionDigits);
    return isCurrency
      ? `$${formatted}${found.suffix}`
      : `${formatted}${found.suffix}`;
  }
  return isCurrency
    ? `$${num.toFixed(fractionDigits)}`
    : num.toFixed(fractionDigits);
}

/**
 *
 * @param str string to capitalize
 * @returns capitalized string hello -> Hello
 */
export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 *
 * @param amount amount to format
 * @param currency currency to use
 * @returns formatted currency
 */
export function formatCurrency(
  amount: number | string | undefined,
  currency: string = "USD",
) {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}
