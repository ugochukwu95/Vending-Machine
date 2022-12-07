const mongoose = require('mongoose')

// Prooducts schema
const ProductsSchema = new mongoose.Schema({
    amountAvailable: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    productName: {
        type: String,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
{
	timestamps: true
})

module.exports = mongoose.model('Product', ProductsSchema)