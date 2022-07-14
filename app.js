const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');
const dotenv = require('dotenv');

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join('public')));

const mongo_uri = process.env.MONGO_URI;

mongoose.connect(mongo_uri, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to DATABASE`);
  }
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const user = new User({ username, password });

  user.save((err) => {
    if (err) {
      res.status(500).send('Error to register to user');
    } else {
      res.status(200).send('User registred successfully');
    }
  });
});

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).send('Error to authenticate to user');
    } else if (!user) {
      res.status(500).send('The user dont exist');
    } else {
      user.isCorrectPassword(password, (err, result) => {
        if (err) {
          res.status(500).send('Error to authenticate');
        } else if (result) {
          res
            .status(200)
            .send(`<h1>Hola ${user.username}, estás logueado. </h1>`);
        } else {
          res.status(500).send('User and/or password incorrect');
        }
      });
    }
  });
});

app.listen(5000, () => {
  console.log('server started');
});

module.exports = app;
