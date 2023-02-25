const express = require("express");
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT , (res,req) => {
    console.log("Server started on port", PORT);
});

app.get("/", (req,res) => {
    res.render("read");
});

app.get("/write", (req,res) => {
    res.render("write");
});