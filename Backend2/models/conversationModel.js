// models/conversationModel.js
const { ObjectId, Long } = require('mongodb');
const { getDb } = require('../db');

const getConversations = async () => {
  const db = getDb();
  return await db.collection('conversations').find().sort({ timestamp: -1 }).toArray();
};

const createConversation = async (conversation) => {
  const db = getDb();
  const result = await db.collection('conversations').insertOne(conversation);
  return result.ops[0];
};


module.exports = {
  getConversations,
  createConversation,

};
