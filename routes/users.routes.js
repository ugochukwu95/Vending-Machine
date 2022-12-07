/**
 * @swagger
 * /user:
 *   post: 
 *      summary: Sign up a user
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Required. The username of the user. This cannot be less than 5 characters
 *               password:
 *                 type: string
 *                 description: Required. Password of the user. This cannot be less than 5 characters
 *               role:
 *                 type: string
 *                 description: Required. the user role
 *      responses:
 *       200:
 *         description: The User auth object.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 *   get: 
 *    summary: Get all users
 *    parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
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
 *      summary: Update a user
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
 *               username:
 *                 type: string
 *                 description: Required. The username of the user
 *      responses:
 *       200:
 *         description: The User auth object.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 *   delete: 
 *      summary: Remove a user
 *      parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *      responses:
 *       200:
 *         description: The User auth object.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 * /user/login:
 *   post: 
 *      summary: Login a user
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Required. The username of the user
 *               password:
 *                 type: string
 *                 description: Required. Password of the user
 *      responses:
 *       200:
 *         description: The User auth object.
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 * 
 * /user/{userId}:
 *   get: 
 *      parameters:
 *          -   in: header
 *              name: auth-token
 *              required: true
 *              description: the jwt token of the logged in user
 *              schema:
 *                  type: string
 *          -   in: path
 *              name: userId
 *              required: true
 *              description: the user document _id
 *              schema:
 *                  type: string
 *      responses:
 *       200:
 *         description: Object
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                description: test response
 */

const express = require('express')
const router = express.Router()

const { createAccount, login, getAllUsers, getAUser, updateUser, removeUser } = require('../controllers/users.controllers')
const { requireUserToLogin } = require('../middlewares/requireLogin')

// CRUD routes
router.post('/', createAccount)
router.post('/login', login)
router.get('/', requireUserToLogin, getAllUsers)
router.get('/:userId', requireUserToLogin, getAUser)
router.put('/', requireUserToLogin, updateUser)
router.delete('/', requireUserToLogin, removeUser)

module.exports = router