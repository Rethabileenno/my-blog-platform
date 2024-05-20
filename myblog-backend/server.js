// Import the express module
const express = require('express');
const fs = require('fs');
// Create an instance of express
const app = express();
// Create an instance of express with options and configuration options for the application component
app.use(express.json());


const blogPostsFile = './blogPosts.json';


const blogPosts = [];

fs.writeFile('./blogPosts.json', JSON.stringify(blogPosts), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('blogPosts.json has been created with an empty array.');
    }
});

app.get('/blogPosts', (req, res) => {
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading blog posts');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/blogPosts', (req, res) => {
    const newPost = req.body;
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading blog posts');
        } else {
            const blogPosts = JSON.parse(data);
            blogPosts.push(newPost);
            fs.writeFile(blogPostsFile, JSON.stringify(blogPosts), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error writing blog posts');
                } else {
                    res.status(201).json(newPost);
                }
            });
        }
    });
});

app.delete('/blogPosts/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading blog posts');
        } else {
            let blogPosts = JSON.parse(data);
            const initialLength = blogPosts.length;
            blogPosts = blogPosts.filter((post) => post.id !== id);
            if (initialLength === blogPosts.length) {
                res.status(404).send('Post not found');
            } else {
                fs.writeFile(blogPostsFile, JSON.stringify(blogPosts), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error writing blog posts');
                    } else {
                        res.status(204).send();
                    }
                });
            }
        }
    });
});

const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));