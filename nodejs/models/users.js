const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        default: "Usuario"
    }
})

module.exports = mongoose.model("User", usersSchema)