require('dotenv').config();

const PORT = process.env.PORT || 3003;
const mongoUrl = process.env.MONGODB_URL;

module.exports = {
  mongoUrl,
  PORT,
};
