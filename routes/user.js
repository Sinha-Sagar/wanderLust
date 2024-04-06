const express = require("express");
const router = express.Router();
const asyncWrap = require("../utilits/asyncWrap.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../isLoggedIn.js");

const userController = require("../controllers/user.js");

router.get("/signup", asyncWrap(userController.signupPage));

router.post("/signup", asyncWrap(userController.signup));

router.get("/login", asyncWrap(userController.loginPage));

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), asyncWrap(userController.login));

router.get("/logout", userController.logout)

module.exports = router;