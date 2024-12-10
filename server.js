const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const sneakersRouter = require('./controllers/sneakers.js');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  console.log(process.env.MONGODB_URI)
});

app.use(cors())
app.use(express.json());

app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/sneakers', sneakersRouter);


const PORT= process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('The express app is ready!');
});