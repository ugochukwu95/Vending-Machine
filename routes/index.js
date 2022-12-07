const express = require('express')
const router = express.Router()

const userRoutes = require('./users.routes')
const productRoutes = require('./products.routes')
const depositRoutes = require('./deposits.routes')
const buyRoutes = require('./buy.routes')
const resetRoutes = require('./reset.routes')

// routes
router.use('/user', userRoutes)
router.use('/product', productRoutes)
router.use('/deposit', depositRoutes)
router.use('/buy', buyRoutes)
router.use('/reset', resetRoutes)

module.exports = router