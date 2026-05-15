export const nameInitial = (name: string): string => {
    // Clean the input and split by whitespace
    const parts = String(name).trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        // Take the first character of the first two words
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    // Handle single words or emails
    const identifier = parts[0] || 'A';
    const text = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    // slice(0, 2) safely handles 1-character strings without returning 'undefined'
    return text.slice(0, 2).toUpperCase();
};