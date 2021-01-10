const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const https = require('https');
// User model
const User = require('../../models/User');

// GET REQUEST http://localhost:5000/api/users/test
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// POST REQUEST http://localhost:5000/api/users/register
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// POST REQUEST http://localhost:5000/api/users/login
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name };

        // Sign Token
        jwt.sign(
          //payload passed with key
          payload,
          //secretOrKey got from ../../config/keys
          keys.secretOrKey,
          //1hour expiration for key
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        return res.status(400).json({ msg: 'Password incorrect' });
      }
    });
  });
});

// GET REQUEST http://localhost:5000/api/users/current
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //gets user id,user name,user email
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

// GET REQUEST http://localhost:5000/api/users/age
router.get(
  '/age',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const query = req.user.name;
    //using the agify.io API to get age of the name
    const url = 'https://api.agify.io/?name=' + query;
    https.get(url, function (response) {
      response.on('data', function (data) {
        console.log(data);
        const ageData = JSON.parse(data);
        console.log(ageData);
        const name = ageData.name;
        const age = ageData.age;
        const count = ageData.count;
        console.log(age);
        res.send('Name: ' + name + '\nAge: ' + age + '\nCount= ' + count);
      });
    });
  }
);

module.exports = router;
