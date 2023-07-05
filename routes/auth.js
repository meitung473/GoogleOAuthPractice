const router = require("express").Router("/auth");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

// 登入
router.get("/login", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/profile");
    res.render("login", {
        user: req.user,
    });
});

router.get("/signup", (req, res) => {
    return res.render("signup", { user: req.user });
});

// 登出
router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) return res.send(err);
        return res.redirect("/");
    });
});

// 當使用者點擊進到 google 登入的按鈕
// 導入到當初再專案設定的登入頁面
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

// 要是登入過程中有問題，驗證失敗要導回到 ?
// 或是完成時會執行這裡的
// 對應 /config/passport.js 中的 new Strategy 中的第二個參數 callback 'cb(done)
// 原先是血 /callback 指的就是 Google 專案頁中我們自己填寫的 redirect 部分
router.get(
    "/google/redirect",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // 成功驗證完後執行的地方
        res.redirect("/profile");
    }
);

router.post("/signup", async (req, res) => {
    try {
        const { name, password, email } = req.body;
        if (password.length < 6) {
            req.flash("error_msg", "密碼長度太短，請重新輸入");
            return res.redirect("/auth/signup");
        }
        // 檢查是否註冊過
        const foundUser = await User.findOne({ email }).exec();

        if (foundUser) {
            // 註冊過了，顯示訊息;
            req.flash("error_msg", "此信箱已經註冊過了，請換一個嘗試");

            return res.redirect("/auth/signup");
        }

        const hashValue = await bcrypt.hash(
            password,
            Number(process.env.BCRYPT_SALTROUND)
        );
        const newUser = new User({
            username: name,
            email,
            password: hashValue,
        });
        await newUser.save();

        req.flash("success_msg", "恭喜註冊成功! 現在可以登入系統了!");
        return res.redirect("/auth/login");
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: "登入失敗。帳號或密碼不正確。",
    }),
    (req, res) => {
        return res.redirect("/profile");
    }
);

module.exports = router;
