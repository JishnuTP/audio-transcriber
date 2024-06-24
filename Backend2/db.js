// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let _db;

const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
    await client.connect();
    console.log('MongoDB Connected');
    _db = client.db("audioTranscriptionDB");
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit process with failure
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error('MongoDB connection not initialized.');
  }
  return _db;
};

module.exports = {
  connectDb,
  getDb,
};
