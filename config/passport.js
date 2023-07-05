const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local");
const User = require("../models/user-model");

const bcrypt = require("bcrypt");

// 哪個屬性要被做成 session ? 資料庫中的 _id
passport.serializeUser((user, done) => {
    done(null, user._id);
});
// 從 session-based cookie 來的
passport.deserializeUser(async (_id, done) => {
    try {
        let foundUser = await User.findOne({ _id }).exec();

        // 把 req.user 設成 foundUser
        done(null, foundUser);
    } catch (e) {
        done(e);
    }
});

// google 驗證
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/google/redirect`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 資料庫要檢查該帳號是否登入過 ?
                const foundUser = await User.findOne({ googleID: profile.id });
                // 如果沒有，代表一次登入
                if (foundUser) {
                    const updateLogInUser = await User.findOneAndUpdate(
                        { _id: foundUser._id },
                        foundUser,
                        {
                            new: true,
                        }
                    ).exec();
                    done(null, updateLogInUser);
                    return;
                }
                const { id, displayName, emails, photos } = profile;
                const newUser = new User({
                    username: displayName,
                    googleID: id,
                    email: emails[0].value,
                    thumbnail: photos[0].value,
                });
                await newUser.save();
                // 寫入資料庫
                done(null, newUser);
            } catch (e) {
                done(e);
            }
        }
    )
);

// 本地登入驗證
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            // 該 email 是否有註冊過 ?
            const foundUser = await User.findOne({ email: username }).exec();
            // 沒有就驗證失敗
            if (!foundUser) return done(null, false);

            // 有，進行比較 bcrypt
            const compareResult = await bcrypt.compare(
                password,
                foundUser.password
            );
            // 不符合 驗證失敗
            if (!compareResult) return done(null, false);
            const updateLogInUser = await User.findOneAndUpdate(
                { _id: foundUser._id },
                foundUser,
                {
                    runValidators: true,
                    new: true,
                }
            ).exec();
            done(null, updateLogInUser);
            // 正確，帶入該筆使用者資訊
            // done(null, foundUser);
        } catch (e) {
            done(e);
        }
    })
);
