
const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@deepgram/sdk');
const conversationModel = require('../models/conversationModel');
require('dotenv').config();

const deepgramSDK = createClient(process.env.DEEPGRAM_API_KEY);
//for trancribe audio
const transcribeAudio = async (req, res,next) => {
  try {
    // Ensure req.file exists and contains the audio file
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No audio file found in request' });
    }

    const fileData = req.file.buffer; // Retrieve the audio file buffer from FormData

    const options = {
      language: 'en-US',
      model: 'enhanced',
      replace: '',
      keyword: '',
    }; // Replace with your desired transcription options

    // Transcribe the audio file using the Deepgram SDK
    const response = await deepgramSDK.listen.prerecorded.transcribeFile(
      fileData,
      options
    );

   

    // Check if response contains expected data structure
    if (
      response &&
      response.result &&
      response.result.results &&
      response.result.results.channels &&
      response.result.results.channels.length > 0 &&
      response.result.results.channels[0].alternatives &&
      response.result.results.channels[0].alternatives.length > 0 &&
      response.result.results.channels[0].alternatives[0].transcript
    ) {
      const transcript =
        response.result.results.channels[0].alternatives[0].transcript;
      res.json({ transcript });
    } else {
      console.error('Error: Unexpected response structure from Deepgram API');
      res.status(500).json({
        error: 'Unexpected response structure from Deepgram API',
      });
    }
  } catch (error) {
   next(error)
    res.status(500).json({ error: 'Error transcribing audio' });
  }
};



// saving trancript text to db
const createConversation = async (req, res, next) => {
  try {
    const { title, transcript } = req.body;
    console.log(req.body);

    // Check if transcript is provided
    if (!transcript) {
      res.status(400);
      throw new Error('Transcript data is missing');
    }

    // Create conversation object
    const conversation = {
      title: req.body.title,
      transcriptions:req.body.transcript,
      timestamp: new Date()
    };

    // Save conversation to database
    const newConversation = await conversationModel.createConversation(conversation);

    res.json(newConversation);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};



//getting all the records
const getAllConversations = async (req, res,next) => {
  try {
    const conversations = await conversationModel.getConversations();
    res.json(conversations);
  } catch (error) {
    next(error)
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};





module.exports = {
  transcribeAudio,
  // getTranscript,
  getAllConversations,
  createConversation,

};
