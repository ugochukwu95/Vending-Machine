const { findOneDocument, saveNewDoc, findAllDocuments, findDocumentToUpdate, findDocumentAndDelete } = require("../helpers/model.helpers")
const { userRoles } = require("../utils/consts")
const { validateRequestForEmptyValues } = require("../utils/utils")


/**
 * @summary - Create a user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createAccount = async (req, res) => {
    let statusCode = 500

    try {
        let user

        const { username, password, role } = req.body

        // validate request
        validateRequestForEmptyValues({ username, password, role })

        // validate role
        if (userRoles.indexOf(role) === -1) {
            statusCode = 400

            throw new Error(`Invalid role, must be any of the following: ${userRoles.join(", ")}`)
        }

        // validate password
        if (password.length < 5) {
            statusCode = 400

            throw new Error("Password can not be less than 5 characters.")
        }

        // validate username
        if (username.length < 5) {
            statusCode = 400

            throw new Error("username can not be less than 5 characters.")
        }

        // check if account doesn't already exists
        try {
            user = await findOneDocument("User", { username })
        }
        catch(err) {}

        if (user) {
            statusCode = 400

            throw new Error(`The username: ${username}, already exists.`)
        }

        // save user to mongo db
        await saveNewDoc("User", { username, password, role })

        return res.status(200).json({
            success: true,
            message: "Successfully created account, kindly login."
        })
    } 
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Login a user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 exports.login = async (req, res) => {
    let statusCode = 500

    try {
        let user;

        const { username, password } = req.body

        // validate request
        validateRequestForEmptyValues({ username, password }) 

        // check if the current user exist
        try {
            user = await findOneDocument("User", { username })
        }
        catch(err) {}

        if (!user) {
            statusCode = 400

            throw new Error("You're not a registered user.")
        }

        // validate the password by coparing password with the model method created in ../models/user.js
        if (!user.comparePassword(password)) {
            statusCode = 400

            throw new Error(`Invalid username or password`)
        }

        // Login successful, write toke, and send back user
        let token = user.generateJWT()

        return res.header("auth-token", token).status(200).json({ success:true, token, user  })
    } 
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Get all users
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUsers = async (req, res) => {
    let statusCode = 500

    try {
        // get information from jwt token in middleware
        const { role } = req.user

        // only sellers should be able to fetch all users
        if (role !== "seller") {
            statusCode = 400
            throw new Error("User must be a seller.")
        }

        const users = await findAllDocuments("User", {})

        return res.status(200).json({
            success: true,
            data: {
                users
            }
        })
    }
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Get a single user
 * @param {*} req 
 * @param {*} res 
 */
exports.getAUser = async (req, res) => {
    let statusCode = 500

    try {
        const { userId } = req.params

        const user = await findOneDocument("User", { _id: userId })

        return res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Update user
 * @param {*} req 
 * @param {*} res 
 */
exports.updateUser = async (req, res) => {
    let statusCode = 500
    let user

    try {
        // cache user id from jwt token in middleware
		const { id } = req.user;

		const { username } = req.body;

        // validate request
        validateRequestForEmptyValues({ username }) 

        // check if account with the username doesn't already exists
        try {
            user = await findOneDocument("User", { username })
        }
        catch(err) {}

        if (user) {
            statusCode = 400

            throw new Error(`The username: ${username}, already exists.`)
        }

		// update user
  		await findDocumentToUpdate(
              "User", 
              { "_id": id },
              { username },
            )

		res.status(200).json({ success: true, message: "Updated successfully." })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}

/**
 * @summary - Removes a user
 * @param {*} req 
 * @param {*} res 
 */
exports.removeUser = async (req, res) => {
    let statusCode = 500;

    try {
        // cache user id from jwt token in middleware
		const { id } = req.user;

        await findDocumentAndDelete("User", id)

        res.status(200).json({ success: true, message: "Successfully deleted user." })
    }
    catch(error) {
        res.status(statusCode).json({ success: false, message: error.message })
    }
}