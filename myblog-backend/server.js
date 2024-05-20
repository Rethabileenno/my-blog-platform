const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/blogPosts', (req, res) => {
    fs.readFile(blogPostsFile, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading blog posts');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/blogPosts', upload.single('media'), (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
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

const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
