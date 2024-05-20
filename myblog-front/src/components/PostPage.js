import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from './CommentForm';

function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/blogPosts/${id}`)
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

        fetch(`/blogPosts/${id}/comments`)
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
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.media && <img src={post.media} alt={post.title} />}
            <CommentForm postId={id} onCommentSubmit={handleCommentSubmit} />
            {comments.map((comment) => (
                <p key={comment.id}>{comment.content}</p>
            ))}
        </div>
    ) : (
        <p>Loading...</p>
    );
}

export default PostPage;
