const mongoose = require('mongoose')

// Transactions schema
const TransactionsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product: {
        type: Object,
        required: true
    },
    status: {
        type: String
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cost: {
        type: Number,
        default: 0
    },
    amountPurchased: {
        type: Number,
        default: 0
    },
},
{
	timestamps: true
})

module.exports = mongoose.model('Transaction', TransactionsSchema)