const express = require('express')
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const dotenv = require('dotenv')
const cors = require('cors')

const routes = require('./routes/index')
const { connectToDB } = require('./config/db')

// cache port
const PORT = process.env.PORT || 5000

// Load env variables
require('dotenv').config()

const app = express()

app.use(express.json()) // body-parser
app.use(cors()) // Enable CORS

// Route files
app.use('/api/v1', routes)

// load swagger for documentation purposes
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Vending Machine API",
            version: "1.0.0",
            description: "Solution for the backend challenge",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Ugochukwu Oguejiofor",
                url: "https://ugooguejiofor.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
                description: "Development server",
            }
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }) );

// Connect to database
connectToDB()

// create express server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))