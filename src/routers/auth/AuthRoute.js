const AuthMiddleware =require('../../middleware/AuthMiddleware')
const authController = require("../../controllers/AuthController");

const router = require("express").Router();

//REGISTER
router.post("/register", authController.registerUser);

//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
//LOG IN
router.post("/login", authController.loginUser);
//LOG OUT
router.post("/logout", AuthMiddleware.verifyToken, authController.logOut);

module.exports = router;