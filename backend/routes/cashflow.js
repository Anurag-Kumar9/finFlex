const express = require('express');
const router = express.Router();

// Store for transactions (Declare once at the top)
let transactions = [];

// Route to add transactions
router.post('/add', (req, res) => {
    const { from, to, amount } = req.body;
    if (!from || !to || !amount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    transactions.push({ from, to, amount });
    res.json({ message: 'Transaction added successfully.', transactions });
});

router.get('/optimize', (req, res) => {
    function minimizeTransactions(transactions) {
        const balances = {};
        transactions.forEach(({ from, to, amount }) => {
            balances[from] = (balances[from] || 0) - amount;
            balances[to] = (balances[to] || 0) + amount;
        });

        const balanceArray = Object.values(balances).filter(b => b !== 0);
        const result = [];

        function settle(start) {
            while (start < balanceArray.length && balanceArray[start] === 0) start++;
            if (start === balanceArray.length) return;

            for (let i = start + 1; i < balanceArray.length; i++) {
                if (balanceArray[start] * balanceArray[i] < 0) {
                    result.push({ from: Object.keys(balances)[start], to: Object.keys(balances)[i], amount: Math.abs(balanceArray[start]) });
                    balanceArray[i] += balanceArray[start];
                    settle(start + 1);
                    balanceArray[i] -= balanceArray[start];
                }
            }
        }

        settle(0);
        return result;
    }

    const optimizedTransactions = minimizeTransactions(transactions);
    res.json({
        message: 'Cash flow optimization completed!',
        optimizedTransactions
    });
});


module.exports = router;
