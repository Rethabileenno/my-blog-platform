const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');


const app = express();

app.use(cors());
// app.use(express.json());
// other middlewares and routes

// app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/blogPosts', (req, res) => {
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading blog posts');
        }
        res.json(JSON.parse(data));
        // res.json([{ id: 1, title: 'First Post', content: 'This is the first post', date: '2023-01-01' }]);

    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const blogPostsFile = path.join(__dirname, 'blogPosts.json');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync(blogPostsFile)) {
    fs.writeFileSync(blogPostsFile, JSON.stringify([]));
}




app.post('/blogPosts', upload.single('media'), (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
        media: req.file ? `/uploads/${req.file.filename}` : null
    };
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading blog posts');
        }
        const blogPosts = JSON.parse(data);
        blogPosts.push(newPost);
        fs.writeFile(blogPostsFile, JSON.stringify(blogPosts), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing blog posts');
            }
            res.status(201).json(newPost);
        });
    });
});



app.get('/blogPosts/:id', (req, res) => {
    console.log(`Fetching post with ID: ${req.params.id}`);

    const { id } = req.params;
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading blog posts');
        }
        const blogPosts = JSON.parse(data);
        const post = blogPosts.find((post) => post.id === parseInt(id));
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.json(post);
    });
});



const commentsFile = path.join(__dirname, 'comments.json');

if (!fs.existsSync(commentsFile)) {
    fs.writeFileSync(commentsFile, JSON.stringify({}));
}


app.get('/blogPosts/:id/comments', (req, res) => {
    console.log(`Fetching comments for post ID: ${req.params.id}`);

    const { id } = req.params;
    fs.readFile(commentsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading comments');
        }
        const comments = JSON.parse(data);
        res.json(comments[id] || []);
    });
});

app.post('/blogPosts/:id/comments', (req, res) => {
    const { id } = req.params;
    const newComment = {
        id: Date.now(),
        content: req.body.content,
    };
    fs.readFile(commentsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading comments');
        }
        const comments = JSON.parse(data);
        if (!comments[id]) {
            comments[id] = [];
        }
        comments[id].push(newComment);
        fs.writeFile(commentsFile, JSON.stringify(comments), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing comments');
            }
            res.status(201).json(newComment);
        });
    });
});



app.delete('/blogPosts/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading blog posts');
        }
        let blogPosts = JSON.parse(data);
        const initialLength = blogPosts.length;
        blogPosts = blogPosts.filter((post) => post.id !== parseInt(id));
        if (initialLength === blogPosts.length) {
            return res.status(404).send('Post not found');
        }
        fs.writeFile(blogPostsFile, JSON.stringify(blogPosts), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing blog posts');
            }
            res.status(204).send();
        });
    });
});

// const port = 3000;
// app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));