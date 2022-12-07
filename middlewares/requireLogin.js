const jwt = require('jsonwebtoken')

/**
 * @summary - Middleware to validate users
 */
exports.requireUserToLogin = (req, res, next) => {
    const token = req.header('auth-token')

    if (!token) {
        return res.status(401).json({ message: 'Login again' })
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token!' })
    }
}