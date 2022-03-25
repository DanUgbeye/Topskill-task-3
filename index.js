require('dotenv').config();
const express = require('express');
const app = express();
const { profileRouter } = require('./routes/routes');
const {connectDb} = require('./model/profileSchema');

app.use(express.json());

app.use('/', profileRouter);

const conn = connectDb();

conn.then( async () => {
  app.listen(process.env.PORT, () => {
    console.log(`app started on port ${process.env.PORT}`);
  });
});
