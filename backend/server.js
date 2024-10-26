const express = require('express');
const app = express();

const adminRouter = require('./routes/adminRouter');
const cookieParser = require('cookie-parser');
const db = require('./configs/mongooseConnection');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())

app.set("view engine", "ejs");

app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("server is running .... ");
});

app.listen(3000);    // handle the port****