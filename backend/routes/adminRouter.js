const express = require('express');
const {adminRegister, adminLogin, adminLogout} = require('../controllers/adminController');
const route = express.Router();

route.get("/register", (req, res) => {
    res.render("register");
});

route.post("/register", adminRegister);

route.get("/login", (req, res) => {
    res.render("login");
});

route.post("/login", adminLogin);

route.get("/logout", adminLogout);

module.exports = route;