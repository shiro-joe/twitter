"use strict";

const { Sequelize, DataTypes } = require("sequelize");

const SEQUELIZE_STORAGE = "bbs.db";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: SEQUELIZE_STORAGE,
});

const Post = sequelize.define("Post", {
    id: {
	type: DataTypes.INTEGER,
	autoIncrement: true,
	primaryKey: true,
    },
    content: {
	type: DataTypes.TEXT,
	allowNull: false,
    },
});

const User = sequelize.define("User", {
    id: {
	type: DataTypes.INTEGER,
	autoIncrement: true,
	primaryKey: true,
    },
    username: {
	type: DataTypes.STRING,
	allowNull: false,
    },
    password:{
	type: DataTypes.STRING,
	allowNull: false,
    },
});

async function setupDatabase(Post, User) {
    try {
	await sequelize.authenticate();
	console.log("Connection has been established successfully.");
    } catch (error) {
	console.error(`Unable to connect to the database: ${error}`);
    }

    User.hasMany(Post, {
	foreignKey: {
	    allowNull: false,
	},
    });

    Post.belongsTo(User);

    await sequelize.sync();
};

module.exports = { Post, User, setupDatabase };
