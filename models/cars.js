const mongoose = require('mongoose')

// cars schema for mongo
const CarSchema = new mongoose.Schema({
    car: {
        type: String,
        required: true,
        trim: true
    },
    average: {
        type:String,
        required: true,
        trim: true
    },
    price: {
        type:String,
        required: true,
        trim: true
    },
    engine: {
        type:String,
        required: true,
        trim: true
    },
    type: {
        type:String,
        required: true,
        trim: true
    }
});

const Cars = mongoose.model("Cars", CarSchema);
module.exports = Cars;