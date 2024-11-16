const express = require('express');
const router = express.Router();

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(loan) {
        this.heap.push(loan);
        this._heapifyUp();
    }

    extractMin() {
        if (this.heap.length === 0) return null;

        const min = this.heap[0];
        const last = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._heapifyDown();
        }

        return min;
    }

    _heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].interestRate >= this.heap[parentIndex].interestRate) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    _heapifyDown() {
        let index = 0;
        const length = this.heap.length;
        while (index < length) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (leftChildIndex < length && this.heap[leftChildIndex].interestRate < this.heap[smallest].interestRate) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].interestRate < this.heap[smallest].interestRate) {
                smallest = rightChildIndex;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

function calculateLoanRepayment(loans, totalPayment) {
    const minHeap = new MinHeap();
    loans.forEach(loan => minHeap.insert(loan));

    let totalRepayment = 0;
    let remainingPayment = totalPayment;

    while (remainingPayment > 0 && !minHeap.isEmpty()) {
        const loan = minHeap.extractMin();
        const interestPayment = loan.amount * loan.interestRate;

        if (remainingPayment >= loan.amount) {
            totalRepayment += loan.amount + interestPayment;
            remainingPayment -= loan.amount;
        } else {
            totalRepayment += remainingPayment + (remainingPayment * loan.interestRate);
            remainingPayment = 0;
        }

        if (loan.amount > remainingPayment) {
            loan.amount -= remainingPayment;
            minHeap.insert(loan);
        }
    }

    return totalRepayment;
}

router.post('/scheduler', (req, res) => {
    const { loans, totalPayment } = req.body;

    if (!loans || !Array.isArray(loans) || !totalPayment) {
        return res.status(400).json({ error: 'Invalid input!' });
    }

    const totalRepayment = calculateLoanRepayment(loans, totalPayment);
    res.json({ totalRepayment });
});

module.exports = router;
