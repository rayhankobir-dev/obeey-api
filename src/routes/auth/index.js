const { Router } = require("express");
const { loginSchema } = require("./schema");
const validation = require("../../middleware/validation");
const loginController = require("../../controllers/auth/login");

const router = new Router();

router.post("/", validation(loginSchema), loginController);

module.exports = { router };
