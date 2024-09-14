"use strict";
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Post, User } = require("./model");

const SALT_ROUNDS = 10;

async function setupPassport(User) {
    passport.use(new LocalStrategy({
	usernameField: "userName",
	passwordField: "password",
    },
				   async (username, password, done) => {
				       const user = await User.findOne({ where: { username: username } });
				       if (user === null) {
					   return done(null, false);
				       }
				       const passwordMatched = await bcrypt.compare(password, user.password);
				       if (passwordMatched !== true) {
					   return done(null, false);
				       }
				       return done(null, user);
				   }
				  ));
    passport.serializeUser((user, cb) => {
	process.nextTick(() => {
	    return cb(null, user.id);
	});
    });

    passport.deserializeUser(async (id, cb) => {
	const user = await User.findByPk(id, {
	    attributes: {
		exclude: ["password"],
	    },
	});
	return cb(null, user);
    });
}

const controller = {
    async get(req, res) {
	if (req.isAuthenticated() === true) {
	    const result = await Post.findAll({
		include: {
		    model: User,
		    attributes: ["username"],
		},
		order: [
		    ["createdAt", "DESC"],
		],
	    });
	    const posts = result.map(e => e.get({ plain: true }));
	    res.render("index.njk", { posts });
	} else {
	    res.redirect("/sign-in");
	}
    },

    getSignUp(req, res) {
	res.render("sign_up.njk");
    },

    async postSignUp(req, res) {
	const userName = req.body.userName;
	const password = req.body.password;
	if (password !== req.body.passwordAgain) {
	    res.redirect("/sign-up");
	    return;
	}
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	try {
	    await User.create({
		username: userName,
		password: hashedPassword,
	    });
	} catch (error) {
	    console.error(`error: ${error}`);
	    res.redirect("/sign-up");
	    return;
	}
	res.redirect("/sign-in");
    },

    getSignIn(req, res) {
	res.render("sign_in.njk");
    },

    postSignIn(req, res) {
	passport.authenticate("local", {
	    successRedirect: "/",
	    failureRedirect: "/sign-in",
	})(req, res);
    },

    postSignOut(req, res) {
	req.logout(() => {
	    res.redirect("/sign-in");
	});
    },

    async postPosts(req, res) {
	if (req.isAuthenticated() === true) {
	    try {
		await Post.create({ content: req.body.content, UserId: req.user.id });
	    } catch (error) {
		console.error(`error: ${error}`);
	    }
	    res.redirect("/");
	} else {
	    res.redirect("/sign-in");
	}
    },

    async getPosts(req, res) {
	if (req.isAuthenticated() === true) {
	    const result = await Post.findAll({
		include: {
		    model: User,
		    attributes: ["username"],
		},
		order: [
		    ["createdAt", "DESC"],
		],
	    });
	    const posts = result.map(e => e.get({ plain: true }));
	    res.status(200);
	    res.json(posts);
	} else {
	    res.status(403);
	}
    },
};
module.exports = { setupPassport, controller };
