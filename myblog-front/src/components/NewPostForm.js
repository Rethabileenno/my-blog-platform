import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Postform.css";

function NewPostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('date', date);
        if (file) {
            formData.append('media', file, file.name);
        }

        fetch('/blogPosts', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create post');
                }
                return response.json();
            })
            .then(() => {
                setTitle('');
                setContent('');
                setDate('');
                setFile(null);
                navigate('/');
            })
            .catch(setError);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2 className="form-title">Add New Post</h2>
            <label className="form-label">
                Title:
                <input className="form-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="form-label">
                Content:
                <textarea className="form-input" value={content} onChange={(e) => setContent(e.target.value)} />
            </label>
            <label className="form-label">
                Date:
                <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="form-label file-input">
                Media:
                <input type="file" onChange={handleFileChange} />
            </label>
            <button className="submit-btn" type="submit">Submit</button>
        </form>
    );
}

export default NewPostForm;
