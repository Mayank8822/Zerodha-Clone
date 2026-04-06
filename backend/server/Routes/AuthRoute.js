const { Signup } = require("../Controller/AuthController.js");
const {Login } = require("../Controller/AuthController.js");
const { userVerification } = require("../Middlewares/AuthMiddleware.js");

const express = require("express");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.post('/', userVerification);

module.exports = router;