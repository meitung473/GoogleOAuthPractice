const Post = require("../models/post-model");
const User = require("../models/user-model");

/**
 * this file shows different ways to render allPosts with user model username
 */

async function getAllPosts(cb) {
    const allPosts = await Post.find({}).exec();
    return cb(allPosts);
}
// with for loop
function getPostWithUserNamePlainLoop() {
    return getAllPosts(async (posts) => {
        let postsWithName = [];
        for (let i = 0; i < posts.length; i++) {
            const foundUser = await User.findOne({
                _id: posts[i].author,
            }).exec();
            posts[i].displayAuthor = foundUser ? foundUser.username : "匿名";
            postsWithName.push(posts[i]);
        }
        return postsWithName;
    });
}

// with for...of loop
function getPostWithUserNameForOf() {
    return getAllPosts(async (posts) => {
        for (let post of posts) {
            const foundUser = await User.findOne({ _id: post.author }).exec();
            post.displayAuthor = foundUser ? foundUser.username : "匿名";
        }
        return posts;
    });
}

// with Array.map & Promise all
function getPostWithUserNameMapPromiseAll() {
    return getAllPosts(async (posts) =>
        Promise.all(
            posts.map((post) => {
                const foundUser = User.findOne({ _id: post.author }).exec();
                return Promise.resolve(foundUser).then((user) => {
                    post.displayAuthor = user ? user.username : "匿名";
                    return post;
                });
            })
        )
    );
}

module.exports = {
    getPostWithUserNamePlainLoop,
    getPostWithUserNameForOf,
    getPostWithUserNameMapPromiseAll,
};
