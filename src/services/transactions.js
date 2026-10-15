export const isIncome = (transaction) => transaction.categoryType === 0;

export const calculateTransactionStats = (transactions) => {
    let incomeCents = 0;
    let expenseCents = 0;

    transactions.forEach((transaction) => {
        const amountCents = Math.round(Math.abs(Number(transaction.amount)) * 100);
        if (isIncome(transaction)) {
            incomeCents += amountCents;
        } else {
            expenseCents += amountCents;
        }
    });

    return {
        income: incomeCents / 100,
        expense: expenseCents / 100,
        balance: (incomeCents - expenseCents) / 100,
    };
};

export const formatTransactionAmount = (transaction) =>
    `${isIncome(transaction) ? '+' : '-'}₺${Math.abs(Number(transaction.amount)).toFixed(2)}`;

export const getLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
