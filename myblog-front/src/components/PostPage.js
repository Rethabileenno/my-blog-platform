import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from './CommentForm';
import apiUrl from '../config';
import './PostPage.css';

function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetch(`/blogPosts/${id}`)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch post');
    //             }
    //             return response.json();
    //         })
    //         .then(setPost)
    //         .catch((error) => {
    //             console.error('Error fetching post:', error);
    //             setError(error);
    //         });

    //     fetch(`/blogPosts/${id}/comments`)
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch comments');
    //             }
    //             return response.json();
    //         })
    //         .then(setComments)
    //         .catch((error) => {
    //             console.error('Error fetching comments:', error);
    //             setError(error);
    //         });
    // }, [id]);

    // const handleCommentSubmit = (newComment) => {
    //     setComments((prevComments) => [...prevComments, newComment]);
    // };

    // if (error) {
    //     return <p>Error: {error.message}</p>;
    // }

    useEffect(() => {
        fetch(`${apiUrl}/blogPosts/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                return response.json();
            })
            .then(setPost)
            .catch((error) => {
                console.error('Error fetching post:', error);
                setError(error);
            });

        fetch(`${apiUrl}/blogPosts/${id}/comments`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .then(setComments)
            .catch((error) => {
                console.error('Error fetching comments:', error);
                setError(error);
            });
    }, [id]);

    const handleCommentSubmit = (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }



    return post ? (
        <div className="post-container">
        <div className="post-content">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-text">{post.content}</p>
            {post.media && <img className="post-media" src={post.media} alt={post.title} />}
        </div>
        <CommentForm postId={id} onCommentSubmit={handleCommentSubmit} />
        <div className="comments-section">
            <h3 className="comments-title">Comments</h3>
            {comments.map((comment) => (
                <p key={comment.id} className="comment-text">{comment.content}</p>
            ))}
        </div>
    </div>
    ) : (
        <p>Loading...</p>
    );
}

export default PostPage;
