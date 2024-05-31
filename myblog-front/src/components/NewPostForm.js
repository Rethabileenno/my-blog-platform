import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../config';

// import { useHistory } from 'react-router-dom';
import "./Postform.css";

function NewPostForm() {



    const handleBack = () => {
        navigate('/');
    };
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

        // fetch('/blogPosts', {
        //     method: 'POST',
        //     body: formData,
        // })
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw new Error('Failed to create post');
        //         }
        //         return response.json();
        //     })
        //     .then(() => {
        //         setTitle('');
        //         setContent('');
        //         setDate('');
        //         setFile(null);
        //         navigate('/');
        //     })
        //     .catch(setError);

        fetch(`${apiUrl}/blogPosts`, {
            method: 'POST',
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.text().then(text => text ? JSON.parse(text) : {})
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


 
    

        useEffect(() => {
            fetch(`${apiUrl}/blogPosts`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Server response was not ok');
                    }
                })
                .then(data => console.log(data))
                .catch(error => console.error('There has been a problem with your fetch operation:', error));
        }, []);


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

  

    return (
        
        <form className="form-container" onSubmit={handleSubmit}>

            <button className="back-btn" type="button" onClick={handleBack}>Back</button>

            <h2 className="heading">Add New Post</h2>
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
