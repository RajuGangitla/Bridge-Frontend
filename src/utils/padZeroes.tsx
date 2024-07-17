export const padDecimals = (amount: number, decimals: number): string => {
    return (amount * Math.pow(10, decimals)).toString();
};