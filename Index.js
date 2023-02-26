const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require("moment/moment");
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const url = "mongodb+srv://hung132132:Hung24072006@qhungmika.z94reif.mongodb.net/diary?retryWrites=true&w=majority";
const mongo = new MongoClient(url, {useNewUrlParser:true});
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
    secret: 'key that will sign cookie',
    resave:false,
    saveUninitialized:false
}))

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(PORT , (res,req) => {
    console.log("Server started on port", PORT);
});

app.get("/read", (req,res) => {
    // res.cookie('qhung', '123')
    // console.log(req.cookies);
    mongo.connect((err, db) =>{
        if(err) throw err;
    
        var dbo = db.db("diary");
    
        dbo.collection("post").find().sort({date: -1}).toArray((err, objs) =>{
            if(err) throw err;

            if(objs.length != 0) console.log("Retrieve data successfully");
            var display = JSON.stringify(objs);
            res.render("read", {post: objs});
            
        })
    })
});
app.get("/write", (req,res) => {
    mongo.connect((err, db) =>{
        if(err) throw err;
    
        var dbo = db.db("diary");
        console.log(req.cookies.userID);
        var query = {user: req.cookies.userID};
    
        dbo.collection("post").find(query, {sort: {date: -1}}).toArray((err, objs) =>{
            if(err) throw err;

            if(objs.length != 0) console.log("Retrieve data successfully");
            var display = JSON.stringify(objs);
            res.render("write", {post: objs});
            
        })
    })
});

app.get('/', (req,res) => {
    res.render('login');
});

app.post('/login/validate', (req,res) => {
    var username = req.body.username;
    res.cookie('userID', username);

    res.redirect('/read');
});

app.post('/write/addPost', (req,res) =>{
    mongo.connect((err, db) =>{
        if(err) throw err;

        var dbo = db.db("diary");
        var date = moment();
        var currentDate = date.format('YYYY-MM-D');
        var newPost = {content: req.body.post, date: currentDate, user: req.cookies.userID};

        dbo.collection("post").insertOne(newPost, (err, result) =>{
            if(err) throw err;
            console.log("Added successfully");
            res.redirect('/write');
        })
    })
});

app.post('/read/search', (req,res) => {
    mongo.connect((err, db) =>{
        if(err) throw err;
        var dbo = db.db("diary");
        var date = req.body.searchInput;
        // var dateInput = date.format('YYYY-MM-D');
        var query = {date: date};
        dbo.collection("post").find(query).toArray((err,objs)=>{
            if (err) throw err;

            if(objs.length != 0) {
                console.log(objs);
                res.render("read", {post: objs});
            } else {
                console.log("not found");
            }
            
        });
    });
});

app.post('/write/search', (req,res) => {
    mongo.connect((err, db) =>{
        if(err) throw err;
        var dbo = db.db("diary");
        var date = req.body.searchInput;
        // var dateInput = date.format('YYYY-MM-D');
        var query = {date: date};
        dbo.collection("post").find(query).toArray((err,objs)=>{
            if (err) throw err;

            if(objs.length != 0) {
                console.log("found");
                res.render("write", {post: objs});
            } else {
                console.log("not found");
            }
            
        });
    });
});
