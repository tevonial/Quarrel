/**
 * Created by tevonial on 5/17/2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwtParse = require('../config/jwt');

var Thread = mongoose.model('Thread');
var Post = mongoose.model('Post');


router.get('/',     list);
router.get('/:id',  findById);
router.post('/',    jwtParse, create);
router.post('/:id', jwtParse, reply);
router.delete('/:id',      jwtParse, deleteThread);
router.delete('/post/:id', jwtParse, deletePost);
module.exports = router;


function list(req, res) {
    Thread.find({})
        .sort('-updated')
        .populate({path:'author', select:'name'})
        .exec(function (err, data) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send(data);
        });
}

function findById(req, res) {
    Thread.findById(req.params.id)
        .populate({
            path: 'posts',
            populate: {
                path: 'author',
                select: 'name'
            }
        }).exec(function (err, data) {
            if (err)    return res.status(500).send('Database error.');
            res.status(200).send(data);
        });
}

function create(req, res) {
    var thread = new Thread();
    thread.title = req.body.title;
    thread.author = req.body.author;

    var originalPost = new Post();
    originalPost.author = req.body.author;
    originalPost.post = req.body.post;

    thread.save(function (err, data) {
        originalPost.thread = data._id;

        originalPost.save(function (err, data) {
            if (err)    return res.status(500).send('Database error.');

            thread.posts.push(data._id);

            thread.save(function (err) {
                if (err)    return res.status(500).send('Database error.');
                res.status(200).send(data);
            });
        });
    });
}

function reply(req, res) {
    Post.create(req.body, function (err, data) {
        if (err)    return res.status(500).send('Database error.');

        var update = {
            $push: {posts: data},
            updated: Date.now()
        };

        Thread.update({_id: data.thread}, update, function (err) {
            if (err)    return res.status(500).send('Database error.');

            res.status(200).send(data);
        });
    });
}

function deleteThread(req, res) {
    Thread.findById(req.params.id, function (err, thread) {
        if (err)    return res.status(500).send('Database error.');

        if (req.payload._id != thread.author) {
            return res.status(401).json({
                "message" : "UnauthorizedError: Must have ownership of thread"
            });
        }

        Post.remove({_id: {$in: thread.posts}}, function (err) {
            if (err)    return res.status(500).send('Database error.');

            thread.remove();
            res.status(200).send();
        });
    });
}

function deletePost(req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err)    return res.status(500).send('Database error.');


        if (req.payload._id != post.author) {
            return res.status(401).json({
                "message" : "UnauthorizedError: Must have ownership of post"
            });
        }

        Thread.findByIdAndUpdate(post.thread, {$pull: {posts: req.params.id}}, function (err) {
            if (err)    return res.status(500).send('Database error.');

            post.remove();
            res.status(200).send();
        });
    });
}