import React, { useState } from 'react';

function CommentForm({ postId, onCommentSubmit }) {
    const [content, setContent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`/blogPosts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to add comment');
                }
                return response.json();
            })
            .then((newComment) => {
                setContent('');
                onCommentSubmit(newComment);
            })
            .catch(console.error);
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
        <label className="form-label">
            Comment:
            <textarea
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment here..."
            />
        </label>
        <button className="submit-btn" type="submit">Submit</button>
    </form>
    );
}

export default CommentForm;
