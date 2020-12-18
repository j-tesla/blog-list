require('dotenv')
  .config();

const PORT = process.env.PORT || 3003;
let mongoUrl = process.env.MONGODB_URL;

if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URL;
}

module.exports = {
  mongoUrl,
  PORT,
};
