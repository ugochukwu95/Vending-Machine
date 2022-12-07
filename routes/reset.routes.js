/**
 * @swagger
 * /reset:
 *   post: 
 *      summary: Endpoint to reset user deposits
 *      parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *      responses:
 *       200:
 *         description: The User object.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 */

const express = require('express')
const { reset } = require('../controllers/reset.controllers')
const router = express.Router()

const { requireUserToLogin } = require('../middlewares/requireLogin')

// routes
router.post('/', requireUserToLogin, reset)

module.exports = router