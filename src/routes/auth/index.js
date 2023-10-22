const { Router } = require("express");
const schema = require("./schema");
const { validation } = require("../../middleware/validation");
// const { ValidationSource } = require("../../helpers/validator");

// middlewares
const authentication = require("../../middleware/auth/authentication");
const authorization = require("../../middleware/auth/authorization");

// controllers
const loginController = require("../../controllers/auth/login");
const signUpController = require("../../controllers/auth/signup");
const logoutController = require("../../controllers/auth/logout");
const tokenController = require("../../controllers/auth/token");

// create router
const router = new Router();

// auth routes
router.post("/login", validation(schema.credential), loginController);
router.post("/signup", validation(schema.signup), signUpController);
router.delete("/logout", authentication(), logoutController);
router.post("/token", tokenController);

module.exports = { router };
