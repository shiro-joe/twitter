"use strict";

const cookieParser = require("cookie-parser");
const express =  require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const passport = require("passport");
const { Post, User, setupDatabase } = require("./model");
const { setupPassport, controller } = require("./controller");

const COOKIE_MAX_AGE = 30 * 1000;
const COOKIE_BASE_OPTIONS = {
    httpOnly: true,
    path: "/",
    secure: false,
};

const PORT = 3000;
const SESSION_SECRET = "foo";

function setupNunjucks(app) {
    const env = nunjucks.configure("views", {
	autoescape: true,
	express: app,
    });

    env.addFilter("formatDate", (value) => {
	const date = value.toISOString();
	return date.slice(0, 10).replaceAll("-", "/") + " " + date.slice(11, 16);
    });
}

async function setupExpress() {
    const app = express();
    app.use(cookieParser());
    app.use(express.static("src/public"));
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
	    ...COOKIE_BASE_OPTIONS,
	    maxAge: COOKIE_MAX_AGE,
	},
    }));
    app.use(passport.session());
    
    app.get("/", controller.get);

    app.get("/sign-up", controller.getSignUp);

    app.post("/sign-up", controller.postSignUp);

    app.get("/sign-in", controller.getSignIn);

    app.post("/sign-in", controller.postSignIn);

    app.get("/sign-out", controller.postSignOut);

    app.post("/posts", controller.postPosts);

    app.get("/posts", controller.getPosts);
    
    return app;
}

async function main() {
    await setupDatabase(Post, User);
    await setupPassport(User);
    const app = await setupExpress();
    setupNunjucks(app);
    app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
    });
}

main().catch(console.error);
