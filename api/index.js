const connectDB = require('../server/config/db');
const app = require('../server/app');

// Cache DB connection across warm Lambda invocations
let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return app(req, res);
};
