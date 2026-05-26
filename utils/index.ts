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