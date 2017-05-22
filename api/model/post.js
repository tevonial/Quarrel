/**
 * Created by tevonial on 5/17/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    date: {type: Date, default: Date.now},
    thread: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: String
});

mongoose.model('Post', postSchema);