const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary folder for storing uploads

// Middleware for handling JSON requests
app.use(express.json());

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
        const flaskResponse = await axios.post('http://192.168.137.65:5000/predict', formData, {
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

// Start Node.js server
app.listen(3000, () => {
    console.log('Node.js server running on http://localhost:3000');
});
