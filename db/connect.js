const mongoose = require("mongoose");

// 部屬時 promise 的 exec() 會有問題
if (process.env.NODE_ENV == "production") {
    mongoose.Promise = global.Promise;
}

module.exports = mongoose.connect(process.env.MONOGODB_CONNECT_URL).then(() => {
    console.log("connect database!");
});
