const mongoose = require('mongoose')

const connectDB = (url) => {
    return mongoose.connect(url, {
        dbName: '06-jobs-api',
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB
