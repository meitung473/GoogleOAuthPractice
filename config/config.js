const dotenv = require("dotenv");
const path = require("path");

const sessionOpts = {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
};
if (process.env.NODE_ENV == "production") {
    dotenv.config();

    // app.set("trust proxy", 1);
    Object.assign(sessionOpts, {
        cookie: {
            secure: true,
        },
        store: require("connect-mongo").create({
            mongoUrl: process.env.MONOGODB_CONNECT_URL,
            autoRemove: "interval",
            autoRemoveInterval: 10, //minute remove
        }),
    });
} else {
    dotenv.config({
        path: path.join(process.cwd(), ".env.local"),
    });
}

Object.assign(sessionOpts, {
    secret: process.env.SESSION_SECRET,
});

exports.sessionOpts = sessionOpts;
