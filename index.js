const { sessionOpts } = require("./config/config");
require("./config/passport");
require("./db/connect");

const express = require("express");
const methodOverride = require("method-override");
const app = express();

const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
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
app.use(session(sessionOpts));
app.use(passport.initialize());
app.use(passport.session());

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
