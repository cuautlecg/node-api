const express = require("express");
const router = express.Router();

const { 
    signup,
    login,
    signout,
    requireSignin
} = require("../controllers/auth");
const { userSignupValidator } = require('../validator/index');

router.post("/signup", userSignupValidator, signup);
router.post("/login", login);
router.get("/signout", signout);

router.get("/hello", requireSignin, (req,res) => {
    res.send('Hola a todos');
});

module.exports = router;