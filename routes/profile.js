const router = require("express").Router("/profile");
const Post = require("../models/post-model");
const User = require("../models/user-model");

// 檢查是否驗證過
const checkUser = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect("/auth/login");
};

router.use(checkUser);

// 如果沒有驗證會導回登入頁面
router.get("/", async (req, res) => {
    const posts = await Post.find({ author: req.user._id }).exec();

    res.render("profile", { user: req.user, posts });
});

// 撰寫貼文
router.get("/post", (req, res) => {
    res.render("post", { user: req.user });
});

router.get("/post/:_id", async (req, res) => {
    const { _id } = req.params;
    const foundPost = await Post.findOne({ _id }).exec();

    const nowUser = await User.findOne({ email: req.user.email }).exec();
    // 確定是同一個使用者

    if (foundPost.author !== nowUser._id.toString()) {
        req.flash("error_msg", "非法操作，權限錯誤");
        return res.redirect("/profile");
    }
    return res.render("update-post", {
        user: req.user,
        post: foundPost,
    });
});

// 發布貼文
router.post("/post", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({
            title,
            content,
            author: req.user._id,
        });
        await newPost.save();
        return res.redirect("/profile");
    } catch (e) {
        req.flash("error_msg", "標題或內容不得空白");
        return res.redirect("/profile/post");
    }
});

router.patch("/post/:_id", async (req, res) => {
    const { _id } = req.params;
    const { title, content } = req.body;
    try {
        const foundPost = await Post.findOne({ _id }).exec();
        // 確定是同一個使用者
        const nowUser = await User.findOne({ email: req.user.email }).exec();

        if (foundPost.author !== nowUser._id.toString()) {
            req.flash("error_msg", "非法操作，權限錯誤");
            return res.redirect("/profile");
        }

        // 更新
        const newPost = await Post.findOneAndUpdate(
            { _id },
            {
                title,
                content,
                updatedAt: Date.now(),
                prevUpdatedAt: foundPost.updatedAt,
            },
            {
                runValidators: true,
                new: true,
            }
        );
        req.flash("success_msg", `成功更新一則貼文`);
        return res.redirect("/profile");
    } catch (e) {
        console.log(e);
        req.flash("error_msg", `操作失敗，請重新操作一次`);
        return res.redirect("/profile");
    }
});

// 刪除文章
router.delete("/post/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const foundPost = await Post.findOne({ _id }).exec();
        const nowUser = await User.findOne({ email: req.user.email }).exec();

        if (foundPost.author !== nowUser._id.toString()) {
            req.flash("error_msg", "非法操作，權限錯誤");
            return res.redirect("/profile");
        }
        const msg = await Post.deleteOne({ _id }).exec();
        if (msg) {
            req.flash("success_msg", "成功刪除文章");
        }
    } catch (e) {
        return res.status(500).render(e);
    } finally {
        return res.redirect("/profile");
    }
});

module.exports = router;
