import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Post from './Post'; // Corrected import path

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
            .catch(setError);
    }, []);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        // <div>
        //     <h1>Welcome to the Blog</h1>
        //     <Link to="/posts/new">Add New Post</Link>
        //     {posts.map((post) => (
        //         <Post key={post.id} post={post} />
        //     ))}
        // </div>

            <div>
            <h2>{posts.title}</h2>
            <p>{posts.content}</p>
            {posts.media && <img src={posts.media} alt={posts.title} />}
            </div>
    );
}

export default HomePage;
