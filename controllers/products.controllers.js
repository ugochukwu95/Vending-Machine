const { findAllDocuments, findOneDocument, findDocumentToUpdate, findDocumentAndDelete, saveNewDoc } = require("../helpers/model.helpers")
const { isNumber, validateRequestForEmptyValues } = require("../utils/utils")


/**
 * @summary - Get all products
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllProducts = async (req, res) => {
    let statusCode = 500

    try {
        const products = await findAllDocuments("Product", {})

        return res.status(200).json({
            success: true,
            data: {
                products
            }
        })
    }
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Get a single product
 * @param {*} req 
 * @param {*} res 
 */
exports.getAProduct = async (req, res) => {
    let statusCode = 500

    try {
        const { productId } = req.params

        const product = await findOneDocument("Product", { _id: productId })

        return res.status(200).json({
            success: true,
            data: {
                product
            }
        })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Create a product
 * @param {*} req 
 * @param {*} res 
 */
exports.createProduct = async (req, res) => {
    let statusCode = 500

    try {
        // get information from jwt token in middleware
        const { role, id } = req.user

        const { amountAvailable, cost, productName } = req.body

        // validate request
        validateRequestForEmptyValues({ amountAvailable, cost, productName })

        // only sellers should be able to create a product
        if (role !== "seller") {
            statusCode = 400
            throw new Error("User must be a seller.")
        }

        // save product to mongo db
        const product = await saveNewDoc("Product", { amountAvailable, cost, productName, sellerId: id })

        return res.status(200).json({
            success: true,
            message: "Created successfully.",
            data: {
                product
            }
        })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Update a product
 * @param {*} req 
 * @param {*} res 
 */
exports.updateProduct = async (req, res) => {
    let statusCode = 500
    let body = {}

    try {
        // get information from jwt token in middleware
        const { role, id } = req.user

        const { amountAvailable, cost, productName } = req.body;

        const { productId } = req.params

        // only sellers should be able to create a product
        if (role !== "seller") {
            statusCode = 400
            throw new Error("User must be a seller.")
        }

        if (isNumber(amountAvailable)) {
            body.amountAvailable = amountAvailable
        }

        if (isNumber(cost)) {
            body.cost = cost
        }

        if (productName) {
            body.productName = productName
        }

        // update a product
        const product = await findDocumentToUpdate(
            "Product", 
            { "sellerId": id, "_id": productId },
            body,
          )

        return res.status(200).json({
            success: true,
            message: "Updated successfully.",
            data: {
                product
            }
        })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Remove a product
 * @param {*} req 
 * @param {*} res 
 */
exports.removeProduct = async (req, res) => {
    let statusCode = 500

    try {
        // get information from jwt token in middleware
        const { role, id } = req.user

        const { productId } = req.params

        // only sellers should be able to create a product
        if (role !== "seller") {
            statusCode = 400
            throw new Error("User must be a seller.")
        }

        // fetch the product to ensure the user created the product
        const product = await findOneDocument("Product", { _id: productId, sellerId: id })

        if (!product) {
            statusCode = 400
            throw new Error("User is not authorised to remove this product.")
        }

        await findDocumentAndDelete("Product", productId)

        res.status(200).json({ success: true, message: "Deleted product successfully." })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}