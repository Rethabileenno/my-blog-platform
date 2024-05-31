const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'https://my-blog-platform-1.onrender.com'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blogPostsFile = path.join(__dirname, 'blogPosts.json');
const commentsFile = path.join(__dirname, 'comments.json');

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
if (!fs.existsSync(commentsFile)) {
    fs.writeFileSync(commentsFile, JSON.stringify({}));
}

// Define the root route
app.get('/', (req, res) => {
    res.send('Backend server is running.');
});

app.get('/blogPosts', (req, res) => {
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading blog posts');
        }
        res.json(JSON.parse(data));
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.get('/blogPosts/:id/comments', (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
