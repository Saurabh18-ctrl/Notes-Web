const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const authRoutes =
require("./routes/auth");



const app = express();



app.use(cors());

app.use(express.json());



mongoose.connect(process.env.MONGO_URL)
.then(() => {

  console.log("MongoDB Connected");

});



app.use("/api/auth", authRoutes);



const PORT =
process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log("Server Running");

});