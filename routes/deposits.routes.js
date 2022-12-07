/**
 * @swagger
 * /deposit:
 *   post: 
 *      summary: Deposit a coin for a user
 *      parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coin:
 *                 type: number
 *                 description: Required. The coin the user wants to deposit. Must be either of 2, 5, 10, 20, 50, 100
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
const router = express.Router()

const { deposit } = require('../controllers/deposits.controllers')
const { requireUserToLogin } = require('../middlewares/requireLogin')

// routes
router.post('/', requireUserToLogin, deposit)

module.exports = router