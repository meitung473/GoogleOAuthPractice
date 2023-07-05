const dotenv = require("dotenv");
dotenv.config();
const MongoStore = require("connect-mongo");
const express = require("express");
// const cors = require("cors");
const methodOverride = require("method-override");
const app = express();
require("./config/connect");

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

require("./config/passport");
const AuthRouter = require("./routes/auth");
const ProfileRouter = require("./routes/profile");

const {
    getPostWithUserNamePlainLoop,
    getPostWithUserNameForOf,
    getPostWithUserNameMapPromiseAll,
} = require("./utils/renderAllPost");
const dateDiff = require("./utils/dateDiff");
const formatDate = require("./utils/formatDate");

app.use(express.static(__dirname + "public"));
app.set("view engine", "ejs");

app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
        store: MongoStore.create({
            mongoUrl: process.env.MONOGODB_CONNECT_URL,
            autoRemove: "interval",
            autoRemoveInterval: 10, //minute remove
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use(cors());
app.use(methodOverride("_method"));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});
// 時間相關的 md
app.use((req, res, next) => {
    res.locals.formatDate = formatDate;
    res.locals.dateDiff = dateDiff;
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRouter);
app.use("/profile", ProfileRouter);

app.get("/", async (req, res) => {
    const allPosts = await getPostWithUserNameMapPromiseAll();

    res.render("index", { user: req.user, posts: allPosts });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("server on !");
});
