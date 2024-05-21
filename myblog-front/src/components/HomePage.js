import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";

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
        <div className="container">
            <header className="header">
            <br/><br/><br/><br/><br/><br/><br/><br/>
                <h1 className="title">Welcome to Parenting Blog for Single Dads<br/></h1>
<h3>Dear Solo Dads and Friends,<br/> Welcome to Solo Dad Chronicles – <br/>your ultimate resource for navigating the joys and challenges of single fatherhood.<br/> We're thrilled to have you join our community of dedicated <br/>dads who are embracing the adventure of raising children solo.</h3>
                <Link to="/posts/new" className="add-post-link">Add New Post</Link>
            </header>
            <section className="hero">
                <h2>Explore Our Latest Posts</h2>
                <p>Thank you for choosing Solo Dad Chronicles as your<br/> trusted companion in the adventure of single fatherhood. <br/>We're honored to have you here, and we can't wait to<br/> embark on this incredible journey together!</p>
            </section>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>{new Date(post.date).toLocaleDateString()}</p> {/* Display the date */}
                        {post.media && <img src={post.media} alt={post.title} className="post-media" />}
                        <Link to={`/posts/${post.id}`} className="read-more">Read More</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
