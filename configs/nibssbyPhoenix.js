const axios = require("axios");

const nibssApi = axios.create({
    baseURL: process.env.NIBSS_BASE_URL,
    timeout: 5000,
    headers:{
        'Content-Type':'application/json'
    }
});

// Function to create authenticated instance with JWT token
const getAuthenticatedApi = (token) => {
    return axios.create({
        baseURL: process.env.NIBSS_BASE_URL,
        timeout: 5000,
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

module.exports = { nibssApi, getAuthenticatedApi};
