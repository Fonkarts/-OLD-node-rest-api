const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);
// Utilisation de mongoose-unique-validator sur ce schéma

module.exports = mongoose.model("User", userSchema);