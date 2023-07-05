const mongoose = require("mongoose");

module.exports = mongoose.connect(process.env.MONOGODB_CONNECT_URL).then(() => {
    console.log("connect database!");
});
