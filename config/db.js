const mongoose = require('mongoose')

// connect to db
exports.connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } 
    catch (err) {
        console.error(err.message)

        // Exit process with failure
        process.exit(1)
    }
}
