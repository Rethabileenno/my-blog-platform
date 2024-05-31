import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import apiUrl from '../config';

async function fetchPosts() {
    const response = await fetch(`${apiUrl}/blogPosts`);
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return await response.json();
}

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts()
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
        <div className="container">
            <header className="header">
                <h1 className="title">Welcome to Parenting Blog for Single Dads</h1>
                <h3>Dear Solo Dads and Friends, Welcome to Solo Dad Chronicles – your ultimate resource for navigating the joys and challenges of single fatherhood. We're thrilled to have you join our community of dedicated dads who are embracing the adventure of raising children solo.</h3>
                <Link to="/posts/new" className="add-post-link">Add New Post</Link>
            </header>
            <section className="hero">
                <h2>Explore Our Latest Posts</h2>
                <p>Thank you for choosing Solo Dad Chronicles as your trusted companion in the adventure of single fatherhood. We're honored to have you here, and we can't wait to embark on this incredible journey together!</p>
            </section>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>{new Date(post.date).toLocaleDateString()}</p>
                        {post.media && <img src={`/uploads${post.media}`} alt={post.title} className="post-media" />}
                        <Link to={`/posts/${post.id}`} className="read-more">Read More</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;