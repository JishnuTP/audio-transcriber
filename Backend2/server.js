// server.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require("cors")
const { connectDb } = require('./db');
const conversationController = require('./controllers/conversationControllers');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;


// Define storage for multer
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the path where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Keep the original filename
    }
  });
const upload = multer({ storage });

// Define storage for multer
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDb();

// Routes

// app.post("api/transcribe",upload.single("audio"),conversationController.getTranscript);
app.post('/api/transcribe', upload.single('audio'), conversationController.transcribeAudio);
app.post('/api/saveTranscription', conversationController.createConversation);
app.get('/api/transcripts', conversationController.getAllConversations);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
