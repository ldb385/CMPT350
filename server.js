
var express = require('express');
var app = express();
var mysql = require('mysql');
var multer = require('multer');
var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use( express.static(__dirname));

var d = new Date;
var change = Math.round( d.getTime() );


var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Testing123',
    database: 'picrev_db'
});


con.connect((err) => {
    if( err) throw err;
    console.log('Connected to PicRev_DB!');
});

var server = app.listen(3012, () => {
    console.log('Server is running on port', server.address().port );
});

// <><><><><><> POPULATE DEFAULT PAGE <><><><><><><>
app.get('/',function(req,res){
    res.sendFile(__dirname + "/home.html");
});


// <><><><><><> SETUP SIMPLE HOME PAGE <><><><><><><>
app.get('/home',function(req,res){
    res.sendFile(__dirname + "/home.html");
});

app.post('/home',function(req,res){
    res.sendFile(__dirname + "/home.html");
});

// <><><><><><> MOVE TO BROWSE PAGE <><><><><><><>
app.get("/seeReviews", function(req, res ){
    res.sendFile( __dirname + "/browse.html");
});

app.post("/seeReviews", function(req, res ){
    res.sendFile( __dirname + "/browse.html");
});

// <><><><><><> SETUP LOGIN SYSTEM <><><><><><><>
app.post("/signUp", function(req, res ){
    var user = req.body.username;
    var pass = req.body.psw;

    // Insert the user in DB
    var sqlUserIns = "INSERT INTO users ( user, password ) VALUES ('" + user + "','" + pass + "')";
    con.query(sqlUserIns, function (err, result) {
        if (err){
            res.sendFile( __dirname + "/browse.html");
        } else {
            console.log( user + " joined picReview.");
        }
    });
    res.redirect('back');
});

app.get("/signIn", function(req, res ){
    var user = req.query.usr;
    var pass = req.query.psw;

    console.log( "Verifying " + user + " and " + pass + ".");

    // check if user has account
    var sqlUserIns = "SELECT * FROM users WHERE user='" + user.toString() + "'";
    con.query(sqlUserIns, function (err, result) {
        if (err){
            // error
            res.send( {validUser: false} );
            console.log( "Invalid user" );
        } else {
            if( result.length > 0 ){
                if( pass.toString() == result[0].password.toString() ){
                    console.log( "valid user" );
                    res.send( {validUser: true} );
                } else {
                    // password incorrect
                    res.send( {validUser: false} );
                    console.log( "Invalid user" );
                }
            } else {
                // user not defined 
                res.send( {validUser: false} );
                console.log( "Invalid user" );
            }
        }
    });
});



// <><><><><><> SETUP LIKE SYSTEM <><><><><><><>
app.post("/likeReview", function(req, res ){
    var reviewToLike = req.body.review;
    // Insert the likes into the sql db
    var sqlLikeIns = "UPDATE likes SET revLike = revLike+1 WHERE review = '" + reviewToLike + "'";
    con.query(sqlLikeIns, function (err, result) {
        if (err) throw err;
        console.log("like inserted");
        });
});

app.get("/likeReviewUpdate", function(req, res ){
    var id = req.query.review;
    console.log("Getting " + id + " likes.");
    // Get the likes from the DB
    var sqlLikeGet = "SELECT revLike FROM likes WHERE review = " + id.toString();
    con.query(sqlLikeGet, function (err, result) {
        if (err) throw err;
        res.send( result );
        });
});

app.get("/likeReview", function(req, res ){
    console.log("Getting likes");
    // Get the likes from the DB
    var sqlLikeGet = "SELECT * FROM likes";
    con.query(sqlLikeGet, function (err, result) {
        if (err) throw err;
        res.send( result );
        });
});


// <><><><><><> TAKE IN IMAGE ATTACHED TO REVIEW <><><><><><><>
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, change.toString() + "_" + file.originalname );
    }
});
  
app.post('/uploadFile',function(req,res){
    var upload = multer({ storage : storage}).single('imageToUpload');
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.redirect("back");
    });
});

// <><><><><><> BROWSE FEATURE FUNCTIONALITY <><><><><><>

// get reviews from the database
app.get('/reviews', function(req, res){

    console.log("Getting reviews");

    var sqlRev = 'SELECT * FROM reviews ORDER BY time desc';

    con.query( sqlRev, function (err, result){
        if(err) throw err;
        res.send(result);
    });
});


// post new reviews to the database
app.post('/reviews', (req, res ) => {

    var description = req.body.des;
    var imagePath = req.body.img;
    var radio = req.body.rad;
    var user = req.body.usr;

    var date = new Date;
    var t = Math.round( date.getTime() );

    if( description != "" && imagePath != "" ){

        // we are hosting a file server so we will link to that instead of local
        var newPath = "http://127.0.0.1:8887/" + change.toString() + "_" + ( imagePath ).replace("C:\\fakepath\\", "");

        // insert the review to the sql db
        var sqlRecIns = "INSERT INTO reviews ( image, description, rate, user, time ) VALUES ('" + newPath.toString() + "','" + description.toString() + "','" + radio + "','" + user.toString() + "','" + t.toString() + "')";
        con.query(sqlRecIns, function (err, result) {
            if (err) throw err;
            console.log("review inserted");
            });

        // Insert the likes into the sql db
        var sqlLikeIns = "INSERT INTO likes ( revLike, review ) VALUES ( 0, '" + t.toString() + "')";
        con.query(sqlLikeIns, function (err, result) {
            if (err) throw err;
            console.log("like inserted");
            });
    } else {
        console.log("Missing fields, not inserted");
    }
    res.redirect('back');
});



// simple get for testing purposes. would like to make sure db connects
app.get('/testingConnectionToDatabase',function(req,res){
    con.query( "SELECT * FROM reviews INNER JOIN likes INNER JOIN users", function (err, result){
        if(err) throw err;
        res.send(result);
    });
});
