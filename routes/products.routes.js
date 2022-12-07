/**
 * @swagger
 * /product:
 *   get: 
 *    summary: Get all products
 *    responses:
 *       200:
 *         description: Object
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 *   post: 
 *    summary: Create a product
 *    parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountAvailable:
 *                 type: number
 *                 description: Required. The amount of products available
 *               cost:
 *                 type: number
 *                 description: Required. The price of the product
 *               productName:
 *                 type: string
 *                 description: Required. the product name
 *    responses:
 *       200:
 *         description: The Product document
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 * /product/{productId}:
 *   get: 
 *    summary: Get a single product
 *    parameters:
 *          -   in: path
 *              name: productId
 *              required: true
 *              description: the product document _id
 *              schema:
 *                  type: string
 *    responses:
 *       200:
 *         description: Object
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 *   put: 
 *      summary: Update a product
 *      parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *          -   in: path
 *              name: productId
 *              required: true
 *              description: the product document _id
 *              schema:
 *                  type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountAvailable:
 *                 type: number
 *                 description: The amount of products available
 *               cost:
 *                 type: number
 *                 description: The price of the product
 *               productName:
 *                 type: string
 *                 description: the product name
 *      responses:
 *       200:
 *         description: The newly updated Product object.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 *   delete: 
 *      summary: Remove a product
 *      parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *          -   in: path
 *              name: productId
 *              required: true
 *              description: the product document _id
 *              schema:
 *                  type: string
 *      responses:
 *       200:
 *         description: a simple message
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 */

const express = require('express')
const router = express.Router()

const { getAllProducts, getAProduct, createProduct, updateProduct, removeProduct } = require('../controllers/products.controllers')
const { requireUserToLogin } = require('../middlewares/requireLogin')

// routes
router.get('/', getAllProducts)
router.post('/', requireUserToLogin, createProduct)
router.get('/:productId', getAProduct)
router.put('/:productId', requireUserToLogin, updateProduct)
router.delete('/:productId', requireUserToLogin, removeProduct)

module.exports = router