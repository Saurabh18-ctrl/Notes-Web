const jwt = require("jsonwebtoken");



module.exports = (req, res, next) => {

  try {

    const token = req.headers.token;



    if (!token) {

      return res.status(401).send({

        message:"No Token"

      });

    }



    const verified = jwt.verify(

      token,

      "secretkey"

    );



    req.user = verified;



    next();

  } catch (error) {

    res.status(500).send(error);

  }

};