/**
 * Created by tevonial on 5/20/2017.
 */


//================================================================================
// Database configuration
//================================================================================
var mongoose = require('mongoose');
var db = 'mongodb://admin:pass@ds137141.mlab.com:37141/tevonial-mean';
// var db = 'mongodb://127.0.0.1:27017/quarrel';
mongoose.connect(db);


//================================================================================
// Model registration
//================================================================================
require('./user');
require('./post');
require('./thread');