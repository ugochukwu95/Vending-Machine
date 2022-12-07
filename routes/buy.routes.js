/**
 * @swagger
 * /buy:
 *   post: 
 *      summary: Endpoint to purchase a product
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
 *               productId:
 *                 type: string
 *                 description: Required. The _id of the product
 *               amount:
 *                 type: number
 *                 description: Required. The amount of products to purchase
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

const { buy } = require('../controllers/buy.controllers')
const { requireUserToLogin } = require('../middlewares/requireLogin')

// routes
router.post('/', requireUserToLogin, buy)

module.exports = router