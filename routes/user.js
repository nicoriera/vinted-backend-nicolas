// Import of the 'express' package
const express = require("express");

// Call the Router() function, from the 'express' package
const router = express.Router();

// uid2 and crypto-js are packages that we will use to encrypt the password
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Import the User and Offer model
// to avoid errors (especially due to possible references between collections)
//
// we need User to perform a search in the DB
// to know :
// - if a user with the same email already exists or not (route signup)
// - which user wants to connect (route login)
const User = require("../models/User");
const Offer = require("../models/Offer");

// declaration of the road signup
router.post("/user/signup", async (req, res) => {
  try {
    // Search in the database. Does a user have this email?
    const user = await User.findOne({ email: req.fields.email });

    // If yes, we send back a message and we do not proceed to the registration
    if (user) {
      res.status(409).json({ message: "This email already has an account" });

      // if not, we go to the next step...
    } else {
      // has the user sent the required information?
      if (req.fields.email && req.fields.password && req.fields.username) {
        // If yes, we can create this new user

        // Step 1: encrypt the password
        // Generate the token and encrypt the password
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        // Step 2: create the new user
        const newUser = new User({
          email: req.fields.email,
          token: token,
          hash: hash,
          salt: salt,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
        });

        // Step 3: save this new user in the database
        await newUser.save();
        res.status(200).json({
          newUser,
        });
        console.log(newUser);
      } else {
        // Did the user not send the required information?
        res.status(400).json({ message: "Missing parameters" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      // Did he/she enter the right password?
      // req.fields.password
      // user.hash
      // user.salt
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

module.exports = router;
