const express = require("express");

const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
// Toutes les routes "user" utilisent les controllers user.

module.exports = router;