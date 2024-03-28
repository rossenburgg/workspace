const axios = require('axios');

// Base URL for the API
const API_BASE_URL = "http://localhost:3000/api"; // Replace with your actual API URL

// Function to fetch courts based on latitude and longitude
async function fetchCourts(latitude, longitude) {
  try {
    const response = await axios.get(`${API_BASE_URL}/courts?latitude=${latitude}&longitude=${longitude}`);
    console.log("Courts fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching courts:", error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  fetchCourts,
};