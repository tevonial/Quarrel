var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

// mongoose.connect('mongodb://admin:pass@ds137141.mlab.com:37141/tevonial-mean');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Initialize backend services/resources
require('./api/model');
require('./api/config/passport');
app.use(passport.initialize());
// app.use(passport.session());


// Routes for API
app.use('/api', require('./api/routes'));
require('./api/config/passport');


// Route for serving main angular app
app.set('views', path.join(__dirname, 'public/view'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {

    var Control = mongoose.model('Control');

    Control.findOne({config: "name"}).exec(function (err, data) {

        if (data === null)
            var name = "Default";
        else
            var name = data.get('value');

        res.render('index', {name: name});
    });
});


//================================================================================
// HTTP Error handling
//================================================================================

// If no other route handlers apply, 404
app.use(function(req, res, next) {
    res.status(404).send('404 Not Found!');
});

// Error handler
app.use(function (err, req, res, next) {
    // HTTP 401 Unauthorized
    if (err.name === 'UnauthorizedError')
        res.status(401);

    // Other errors
    else
        res.status(500);

    res.json({"message" : err.name + ": " + err.message});
});

module.exports = app;
