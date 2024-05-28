import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function CommentForm({ postId, onCommentSubmit }) {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/');
    };
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
        
        <form className="form-container" onSubmit={handleSubmit}>
        <button className="back-btn" type="button" onClick={handleBack}>Back</button>
<br/><br/>
        <label className="form-label">
            Comment:
            <textarea
                className="form-input"
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
