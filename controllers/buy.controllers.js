const { findOneDocument, findDocumentToUpdate, saveNewDoc, findAllDocuments } = require("../helpers/model.helpers")
const { validateRequestForEmptyValues, isNumber } = require("../utils/utils")

/**
 * @summary - Endpoint to purchase products
 * @param {*} req 
 * @param {*} res 
 */
exports.buy = async (req, res) => {
    let statusCode = 500
    let user
    let product
    let depositLeft
    let amountOfProductsLeft
    let totalSpent = 0

    try {
        // get information from jwt token in middleware
        const { role, id } = req.user

        const { productId, amount } = req.body

        // only buyers should be able to purchase a product
        if (role !== "buyer") {
            statusCode = 400
            throw new Error("User must be a buyer.")
        }

        validateRequestForEmptyValues({ productId, amount })

        // validate amount passed
        if (!isNumber(amount) || amount <= 0) {
            statusCode = 400
            throw new Error("Bad request, amount must be greater than zero and be a numeric value")
        }

        // cache user
        user = await findOneDocument("User", { _id: id })

        if (!user) {
            statusCode = 400
            throw new Error("Bad request, user does not exist")
        }

        user = user.toObject()

        // check if user has enough cash deposits
        if (user.deposit <= 0) {
            statusCode = 400
            throw new Error("Bad request, user does not have enough cash deposits")
        }

        // cache product
        product = await findOneDocument("Product", { _id: productId })

        if (!product) {
            statusCode = 400
            throw new Error("Bad request, product does not exist")
        }

        product = product.toObject()

        // check if product is available for purchase
        if (product.amountAvailable <= 0 || product.amountAvailable < amount) {
            statusCode = 400
            throw new Error(`There are just ${product.amountAvailable} ${product.productName} products available.`)
        }

        // check if user can afford this product
        if (product.cost > (amount * user.deposit)) {
            statusCode = 400
            throw new Error(`You do not have enough deposits to purchase ${amount} ${product.productName} products`)
        }

        // calculate deposits left
        depositLeft = (amount * user.deposit) - product.cost

        // calculate products left
        amountOfProductsLeft = product.amountAvailable - amount

        // update user document with deposit left
        const updatedUser = await findDocumentToUpdate(
            "User", 
            { _id: id },
            { deposit: depositLeft < 0 ? 0 : depositLeft },
          )

        // update product document with amont left
        const updatedProduct = await findDocumentToUpdate(
            "Product", 
            { _id: productId },
            { amountAvailable: amountOfProductsLeft < 0 ? 0 : amountOfProductsLeft },
          )

        // create new transaction
        await saveNewDoc("Transaction", { productId, product: updatedProduct, status: "success", buyerId: id, cost: product.cost, amountPurchased: amount })

        // get all transactions made by user
        let transactions = await findAllDocuments("Transaction", { buyerId: id })

        // calculate total amount spent by user
        if (Array.isArray(transactions) && transactions.length > 0) {
            for (let i=0; i<transactions.length; i++) {
                totalSpent += transactions[i].cost || 0
            }
        }

        res.status(200).json({ 
            success: true, 
            message: "Transaction completed successfully.",
            data: {
                totalSpent,
                productsPurchased: transactions,
                change: depositLeft < 0 ? 0 : depositLeft
            }
        })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}