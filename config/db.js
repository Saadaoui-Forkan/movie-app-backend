const mongoose = require('mongoose')
require('dotenv').config();

const db = process.env.mongoURI

const connectDB = async () => {
    try {
      await mongoose.connect(db,{
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
      }) 
      console.log('mongodb connected ...') 
    } catch (err) {
        console.error(err.message)
        // Exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB