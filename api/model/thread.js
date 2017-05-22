/**
 * Created by tevonial on 5/17/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var threadSchema = new Schema({
    title: String,
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

mongoose.model('Thread', threadSchema);