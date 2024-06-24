
const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@deepgram/sdk');
const conversationModel = require('../models/conversationModel');
require('dotenv').config();

// import { createClient } from "@deepgram/sdk";
// import dotenv from "dotenv";
// dotenv.config();

const deepgramSDK = createClient(process.env.DEEPGRAM_API_KEY);

const transcribeAudio = async (req, res) => {
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
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Error transcribing audio' });
  }
};



const getAllConversations = async (req, res) => {
  console.log("getting");
  try {
    const conversations = await conversationModel.getConversations();
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};

const createConversation = async (req, res) => {
  console.log("Creating conversation with:", req.body);

  try {
    const { title, transcript } = req.body;

    // Check if transcript is provided
    if (!transcript) {
      throw new Error('Transcript data is missing');
    }

    // Create conversation object
    const conversation = {
      title: title,
      transcriptions: transcript,

      timestamp: new Date()
    };

    // Save conversation to database
    const newConversation = await conversationModel.createConversation(conversation);

    res.json(newConversation);
  } catch (error) {

    res.status(500).json({ error: 'Error creating conversation' });
  }
};



module.exports = {
  transcribeAudio,
  // getTranscript,
  getAllConversations,
  createConversation,

};
