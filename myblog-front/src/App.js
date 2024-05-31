
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PostPage from './components/PostPage';
import NewPostForm from './components/NewPostForm';

 

function App() {
    const [newPost, setNewPost] = useState(null);

    const handleNewPost = (post) => {
      setNewPost(post);
    };

    return (
        <Router>
            <Routes>
                <Route path="/posts/new" element={<NewPostForm />} />
                <Route path="/posts/:id" element={<PostPage />} />
                <Route path="/" element={<HomePage />} />
                <HomePage newPost={newPost} />

            </Routes>
        </Router>
    );
}

export default App;
