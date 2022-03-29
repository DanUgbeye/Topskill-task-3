require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
// const jwt = require('express-jwt');
// const jwks = require('jwks-rsa');
const { auth, requiresAuth } = require('express-openid-connect');

const { profileRouter } = require('./routes/routes');
const {connectDb} = require('./model/profileSchema');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	max: 14, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

app.use(auth(config));

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use('/', requiresAuth(), profileRouter);

const conn = connectDb();

conn.then( async () => {
  app.listen(process.env.PORT, () => {
    console.log(`app started on port ${process.env.PORT}`);
  });
});
