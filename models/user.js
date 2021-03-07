const mongoose = require('mongoose')

// userSchema for authentication and user login / register
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Users = mongoose.model("User", UserSchema);
module.exports = Users;