// Export modules from this directory

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

export const formatCompact = (num: number, isCurrency = false, fractionDigits = 2) => {
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
};