const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can choose any available port

// Middleware configuration
app.use(cors());
app.use(bodyParser.json());
const upload = multer({ dest: 'uploads/' }); // Temporary folder for storing uploads

// Endpoint to handle image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const filePath = path.resolve(req.file.path);

        // Prepare file for Flask API
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Send file to Flask API
        const flaskResponse = await axios.post('http://192.168.137.65:5000/classify', formData, {
            headers: formData.getHeaders(),
        });

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Return Flask API response to frontend
        res.json(flaskResponse.data);
    } catch (error) {
        console.error('Error forwarding to Flask:', error.message);
        res.status(500).json({ error: 'Error processing image' });
    }
});

// Endpoint to handle chat messages
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const targetLanguage = req.body.language; // Optional, if you want to send language info

    try {
        const response = await axios.post('http://192.168.137.65:5000/chat', {
            message: userMessage,
            language: targetLanguage
        });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error('Error communicating with chatbot:', error);
        res.status(500).json({ error: 'Error communicating with chatbot' });
    }
});

// Start Node.js server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
