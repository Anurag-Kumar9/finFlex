const express = require('express');
const router = express.Router();

// Tax Slabs
const taxSlabs = [
    [10000, 0.1],
    [20000, 0.2],
    [50000, 0.3],
    [Infinity, 0.4]
];

class SegmentTree {
    constructor(slabs) {
        this.n = slabs.length;
        this.tree = Array(4 * this.n);
        this.build(slabs, 0, 0, this.n - 1);
    }

    build(slabs, node, start, end) {
        if (start === end) {
            this.tree[node] = slabs[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            this.build(slabs, 2 * node + 1, start, mid);
            this.build(slabs, 2 * node + 2, mid + 1, end);
            this.tree[node] = this.merge(this.tree[2 * node + 1], this.tree[2 * node + 2]);
        }
    }

    query(node, start, end, l, r) {
        if (r < start || end < l) return null;
        if (l <= start && end <= r) return this.tree[node];
        const mid = Math.floor((start + end) / 2);
        const leftQuery = this.query(2 * node + 1, start, mid, l, r);
        const rightQuery = this.query(2 * node + 2, mid + 1, end, l, r);
        return this.merge(leftQuery, rightQuery);
    }

    merge(left, right) {
        if (!left) return right;
        if (!right) return left;
        return left[0] < right[0] ? left : right;
    }
}

function calculateTax(income, taxSlabs, deductions) {
    const dp = new Array(income + 1).fill(0);
    for (let i = 0; i <= income; i++) dp[i] = i;
    deductions.forEach(deduction => {
        for (let i = income; i >= deduction; i--) {
            dp[i] = Math.min(dp[i], dp[i - deduction]);
        }
    });
    const optimizedIncome = dp[income];
    const segmentTree = new SegmentTree(taxSlabs);

    return calculateTaxRecursive(optimizedIncome, segmentTree, 0, taxSlabs.length - 1);
}

function calculateTaxRecursive(income, segmentTree, left, right) {
    if (left > right) return 0;
    const mid = Math.floor((left + right) / 2);
    const slab = segmentTree.query(0, 0, segmentTree.n - 1, left, mid);
    if (!slab) return 0;
    if (income <= slab[0]) return income * slab[1];
    return calculateTaxRecursive(income - slab[0], segmentTree, mid + 1, right) + slab[0] * slab[1];
}

router.post('/calculate', (req, res) => {
    const { income, deductions } = req.body;
    if (!income || !Array.isArray(deductions)) {
        return res.status(400).json({ error: 'Invalid input!' });
    }

    const tax = calculateTax(income, taxSlabs, deductions);
    res.json({ tax });
});

module.exports = router;
