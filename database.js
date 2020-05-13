const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

var isOpen = false;
var mongod = null;

module.exports.connect = async (url) => {
  // If we are already connected, just return.
  if (isOpen) return;

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE, // try connecting to the database as many times as it can
    reconnectInterval: 1000           // reconnect every one second
  };
  
  // Use an in-memory mongodb server if database URL is not provided.
  if (!url) {
    mongod = new MongoMemoryServer();
    url = await mongod.getConnectionString();
  }

  console.log("Connection string: " + url);

  await mongoose.connect(url, mongooseOpts);
  isOpen = true;  // TODO: check result condition
};

module.exports.close = async () => {
  if (!isOpen) return;

  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }

  isOpen = false;
};
