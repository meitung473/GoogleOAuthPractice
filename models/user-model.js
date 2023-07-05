const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            maxLength: 20,
            minLength: 2,
        },
        // 用 google 登入的人
        googleID: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        // local login
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            minLength: [6, "密碼太短了，安全性不足"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
