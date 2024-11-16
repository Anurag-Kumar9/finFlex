document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    // Validate input
    if (!from || !to || isNaN(amount) || amount <= 0) {
        alert('Please fill out all fields correctly with a positive amount.');
        return;
    }

    try {
        // Send request to the server
        const response = await fetch('http://localhost:3001/api/cashflow/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to, amount }),
        });

        // Process the response
        const result = await response.json();
        console.log('Server response:', result); // Log the server response

        if (response.ok) {
            alert('Transaction added successfully!');
            document.getElementById('transactionForm').reset(); // Reset the form fields
            document.getElementById('output').textContent = 'Transaction successfully added.';
        } else {
            alert('Failed to add transaction: ' + (result.message || 'Unknown error.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the transaction. Please try again later.');
    }
});

document.getElementById('optimizeBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3001/api/cashflow/optimize');
        const result = await response.json();
        console.log('Optimization response:', result); // Log the optimization response

        if (result.optimizedTransactions && result.optimizedTransactions.length > 0) {
            let output = 'Optimized Cash Flow Suggestions:\n\n';
            result.optimizedTransactions.forEach(tx => {
                output += `${tx.from} should pay ${tx.to}: $${tx.amount}\n`;
            });
            document.getElementById('output').textContent = output;
        } else {
            document.getElementById('output').textContent = 'No optimization needed or no transactions to optimize.';
        }
    } catch (error) {
        console.error('Error optimizing cash flow:', error);
        document.getElementById('output').textContent = 'An error occurred while optimizing cash flow. Please try again.';
    }
});
