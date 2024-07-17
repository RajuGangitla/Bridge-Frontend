export const padDecimals = (amount: number, decimals: number) => {
    let [integerPart, fractionalPart] = amount.toString().split('.');
    fractionalPart = fractionalPart || ''; // Initialize if undefined

    // Pad fractional part with zeroes
    while (fractionalPart.length < decimals) {
        fractionalPart += '0';
    }

    // Combine integer part and padded fractional part
    return integerPart + fractionalPart;
};