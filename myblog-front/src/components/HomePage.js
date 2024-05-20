import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/blogPosts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(setPosts)
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(error);
            });
    }, []);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <h1>Welcome to the Blog</h1>
            <Link to="/posts/new">Add New Post</Link>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    {post.media && <img src={post.media} alt={post.title} />}
                    <Link to={`/posts/${post.id}`}>Read More</Link>
                </div>
            ))}
        </div>
    );
}

export default HomePage;
