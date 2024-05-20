import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
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
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
                Content:
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </label>
            <label>
                Media:
                <input type="file" onChange={handleFileChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default NewPostForm;
