const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

var isOpen = false;
var mongod = null;

module.exports.connect = async (url) => {
  if (isOpen) return;

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };
  
  // use an in-memory mongodb server if url is not provided
  if (!url) {
    mongod = new MongoMemoryServer();
    url = await mongod.getConnectionString();
  }

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
