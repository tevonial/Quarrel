/**
 * Created by tevonial on 5/20/2017.
 */


//================================================================================
// Database configuration
//================================================================================
var mongoose = require('mongoose');

var db = 'mongodb://admin:pass@ds137141.mlab.com:37141/tevonial-mean';
mongoose.connect(db);


//================================================================================
// Model registration
//================================================================================
require('./user');
require('./post');
require('./thread');