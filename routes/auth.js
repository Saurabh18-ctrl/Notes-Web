
   const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const Note = require("../models/Note");

const authMiddleware =
require("../middleware/authMiddleware");



router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } =
      req.body;



    const user = new User({

      name,
      email,
      password

    });



    await user.save();



    const token = jwt.sign(

      {

        id:user._id

      },

      "secretkey"

    );



    res.send({

      token

    });

  } catch (error) {

    res.status(500).send(error);

  }

});



router.post("/login", async (req, res) => {

  try {

    const { email, password } =
      req.body;



    const user = await User.findOne({

      email,
      password

    });



    if (!user) {

      return res.status(400).send({

        message:"Invalid Credentials"

      });

    }



    const token = jwt.sign(

      {

        id:user._id

      },

      "secretkey"

    );



    res.send({

      token

    });

  } catch (error) {

    res.status(500).send(error);

  }

});



router.post(

  "/create-note",

  authMiddleware,

  async (req, res) => {

    try {

      const { title, content } =
        req.body;



      const newNote = new Note({

        title,
        content,
        userId:req.user.id

      });



      await newNote.save();



      res.send({

        success:true,

        message:"Note Saved"

      });

    } catch (error) {

      res.status(500).send(error);

    }

  }
);



router.get(

  "/get-notes",

  authMiddleware,

  async (req, res) => {

    try {

      const notes = await Note.find({

        userId:req.user.id

      });



      res.send(notes);

    } catch (error) {

      res.status(500).send(error);

    }

  }
);



router.delete(

  "/delete-note/:id",

  authMiddleware,

  async (req, res) => {

    try {

      await Note.findByIdAndDelete(

        req.params.id

      );



      res.send({

        message:"Deleted"

      });

    } catch (error) {

      res.status(500).send(error);

    }

  }
);



module.exports = router;