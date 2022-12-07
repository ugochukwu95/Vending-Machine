const { findOneDocument, findDocumentToUpdate } = require("../helpers/model.helpers")
const { acceptedCoins } = require("../utils/consts")
const { isNumber } = require("../utils/utils")

/**
 * @summary - Deposit a coin amount for a user
 * @param {*} req 
 * @param {*} res 
 */
exports.deposit = async (req, res) => {
    let statusCode = 500

    try {
        // get information from jwt token in middleware
        const { role, id } = req.user

        const { coin } = req.body

        // validate request
        if (!isNumber(coin)) {
            statusCode = 400
            throw new Error("Bad request. 'coin' must be a numeric value")
        }

        if (acceptedCoins.indexOf(coin) === -1) {
            statusCode = 400
            throw new Error(`Bad request. 'coin' must be any of these values: ${acceptedCoins.join(", ")}`)
        }

        // only buyers should be able to make a ddeposit
        if (role !== "buyer") {
            statusCode = 400
            throw new Error("User must be a buyer.")
        }

        // fetch user
        let user = await findOneDocument("User", { _id: id })

        if (!user) {
            statusCode = 400
            throw new Error("Bad request")
        }

        // convert mongoose object to javascript object
        user = user.toObject()

        // cache past deposit amount
        let deposit = Number(user.deposit)

        deposit += Number(coin)

        // update user document with the new deposit
  		await findDocumentToUpdate(
            "User", 
            { "_id": id },
            { deposit },
          )

        res.status(200).json({ success: true, message: "Deposited successfully." })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}