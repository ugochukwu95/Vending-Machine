const { findDocumentToUpdate } = require("../helpers/model.helpers")

/**
 * @summary - reset user deposits
 * @param {*} req 
 * @param {*} res 
 */
exports.reset = async (req, res) => {
    let statusCode = 500

    try {
        // get information from jwt token in middleware
        const { role, id } = req.user

        // only buyers should be able to purchase a product
        if (role !== "buyer") {
            statusCode = 400
            throw new Error("User must be a buyer.")
        }

        await findDocumentToUpdate(
            "User", 
            { _id: id },
            { deposit: 0 },
          )

        res.status(200).json({ 
            success: true, 
            message: "Your deposits have been reset.",
        })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}