export const generateDynamicNigerianBankDetails = () => {
    const banks = [
        "Guaranty Trust Bank (GTBank)",
        "Access Bank",
        "Zenith Bank",
        "United Bank for Africa (UBA)",
        "First Bank of Nigeria"
    ];
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    // Generate a 10-digit account number starting with standard prefixes
    const prefixes = ["01", "02", "06", "04", "07"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
    const accountNumber = `${prefix}${random8Digits}`;
    // Simple random alphanumeric reference for the account name
    const randomRef = Math.random().toString(36).substring(2, 6).toUpperCase();
    const accountName = `N&B Italian Hotel - ${randomRef}`;
    return {
        bankName: randomBank,
        accountNumber,
        accountName
    };
};
//# sourceMappingURL=paymentGenerator.js.map