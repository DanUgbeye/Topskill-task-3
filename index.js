require('dotenv').config();
const express = require('express');
const { profileRouter } = require('./routes/routes');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const {connectDb} = require('./model/profileSchema');
const { auth } = require('express-openid-connect');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'))
app.use(express.json());
app.use(auth());

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	max: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-f68wxe3v.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'localhost:3000',
    issuer: 'https://dev-f68wxe3v.us.auth0.com/',
    algorithms: ['RS256']
});

app.use(jwtCheck);
app.set('trust proxy', true);

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use('/', profileRouter);

const conn = connectDb();

conn.then( async () => {
  app.listen(process.env.PORT, () => {
    console.log(`app started on port ${process.env.PORT}`);
  });
});
