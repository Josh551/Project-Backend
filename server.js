const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const db = require('./config/keys').mongoURI;
global.CronJob = require('./cron.js');

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);

//route http://localhost:5000/
app.listen(process.env.PORT || 5000, function () {
  console.log(`Server started on port 5000`);
});