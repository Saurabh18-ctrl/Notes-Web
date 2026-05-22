const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const Note = require("../models/Note");

const authMiddleware = require("../middleware/authMiddleware");



// ================= SIGNUP =================

router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;



    const userExists = await User.findOne({
      email
    });



    if (userExists) {

      return res.send({
        message: "User Already Exists"
      });

    }



    const hashedPassword = await bcrypt.hash(
      password,
      10
    );



    const newUser = new User({

      name,
      email,
      password: hashedPassword

    });



    await newUser.save();



    const token = jwt.sign(

      {
        id: newUser._id
      },

      "secretkey"

    );



    res.send({

      message: "Registration Successful",

      token

    });

  } catch (error) {

    res.status(500).send(error);

  }

});



// ================= LOGIN =================

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;



    const user = await User.findOne({
      email
    });



    if (!user) {

      return res.send({
        message: "User Not Found"
      });

    }



    const isMatch = await bcrypt.compare(

      password,

      user.password

    );



    if (!isMatch) {

      return res.send({
        message: "Invalid Credentials"
      });

    }



    const token = jwt.sign(

      {
        id: user._id
      },

      "secretkey"

    );



    res.send({

      message: "Login Successful",

      token

    });

  } catch (error) {

    res.status(500).send(error);

  }

});



// ================= CREATE NOTE =================

router.post(

  "/create-note",

  authMiddleware,

  async (req, res) => {

    try {

      const { title, content } = req.body;



      const newNote = new Note({

        title,

        content,

        userId: req.user.id

      });



      await newNote.save();



      res.send({

        message: "Note Saved"

      });

    } catch (error) {

      res.status(500).send(error);

    }

  }

);



// ================= GET NOTES =================

router.get(

  "/get-notes",

  authMiddleware,

  async (req, res) => {

    try {

      const notes = await Note.find({

        userId: req.user.id

      });



      res.send(notes);

    } catch (error) {

      res.status(500).send(error);

    }

  }

);



module.exports = router;