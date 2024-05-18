// myblog-backend/server.js

const express = require('express');
const fs = require('fs');
const app = express();































// app.use(express.json());

// // An array to store blog posts
// let posts = [];

// app.get('/api/posts', (req, res) => {
//     res.json(posts);
// });

// app.post('/api/posts', (req, res) => {
//     const post = req.body;
//     posts.push(post);
//     res.status(201).json(post);
// });



// // An array to store comments for each blog post
// let comments = {};

// app.get('/api/posts/:id', (req, res) => {
//     const postId = Number(req.params.id);
//     const post = posts.find(post => post.id === postId);
//     if (post) {
//         res.json(post);
//     } else {
//         res.status(404).send('Post not found');
//     }
// });

// app.post('/api/posts/:id/comments', (req, res) => {
//     const postId = req.params.id;
//     const comment = req.body;
//     if (comments[postId]) {
//         comments[postId].push(comment);
//     } else {
//         comments[postId] = [comment];
//     }
//     res.status(201).json(comment);
// });

// app.get('/api/posts/:id/comments', (req, res) => {
//     const postId = req.params.id;
//     res.json(comments[postId] || []);
// });

// app.listen(3000, () => console.log('Server running on port 3000'));