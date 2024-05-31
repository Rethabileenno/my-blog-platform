// src/config.js
const apiUrl = process.env.REACT_APP_API_URL || 'https://my-blog-platform.onrender.com';

export default apiUrl;

// import apiUrl from './config';

// Example fetch call in your component
fetch(`${apiUrl}/blogPosts`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
