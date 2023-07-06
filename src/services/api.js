import axios from 'axios';

const apiKey = '3c6589d335c0f9d7f3d59fba6a8ea553'; // Replace with your own API key

export default axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        api_key: apiKey,
    },
});
