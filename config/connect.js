const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
module.exports = mongoose.connect(process.env.MONOGODB_CONNECT_URL).then(() => {
    console.log("connect database!");
});
