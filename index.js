const express = require("express");
const app = express();
require("./db/connect");
const users = require("./models/userSchema");
const Notes = require("./models/Notesschema");
const fs = require("fs");
var cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const fetchall = require("./Middleware/dataAuth");
require('dotenv').config();
const SECRET_KEY = "Rahul03";
app.use(cors());
const port = process.env.PORT || 5000;
const URL = process.env.BASE_URI;
app.use(express.json());
// app.use(cookieParser());

//password hash
const securePassword = async (password) => {
  try {
    const hashdata = await bcrypt.hash(password, 10);
    return hashdata;
  } catch (error) {
    console.log("User login invalide");
  }
};

app.post("/registeration", async (req, res) => {
  try {

    // const salt = await bcrypt.genSalt(10);
    // const newPassword = await bcrypt.hash(req.body.password, salt);
    // without below code do above code
    const newPassword = await securePassword(req.body.password);
    const user = new users({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    // jwt token generate
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = JWT.sign(data, SECRET_KEY);
    success = true;
    res.json({ success, token: token });
    
    const dataSave = await user.save();
    console.log(dataSave);
    console.log("register succesfully");
  } catch (error) {
    console.log(error);
    console.log({ message: "Not register profile" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await users.findOne({ email: email });
    if (!user) {
      success = false;

      res.status(400).json({ success, message: "invalid user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      success = false;
      res.status(400).json({ success, message: "invalid password" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const token = JWT.sign(data, SECRET_KEY);
    success = true;
    res.json({ success, token: token });
    // console.log(isMatch);

    console.log(token);
    console.log({ message: "login  profile successfully" });

  } catch (error) {
    console.log({ message: "login  profile invalide" });
  }
});

//get all userSelect:
app.post("/getuser", fetchall, async (req, res) => {
  try {
    //  const ;
    userID = req.user.id;
    const user = await users.findById(userID).select("-password");
    res.json(user);
  } catch (error) {
    console.log({ message: "get all users invalid" });
  }
});

// --------------------------------------------------------------------------------------------

//NOtes Routes

// fetchallnotes-
app.get("/getallnotes", fetchall, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log({ message: "get all users invalid" });
  }
});

//
app.post("/addnotes", fetchall, async (req, res) => {
  try {
    const { title, desc, tag } = req.body;
    const notes = new Notes({
      title,
      desc,
      tag,
      user: req.user.id,
    });
    const data = await notes.save();
    res.json(data);
  } catch (error) {
    console.log({ message: "get all users invalid" });
  }
});
//
app.put("/edit/:id", fetchall, async (req, res) => {
  try {
    const { title, desc, tag } = req.body;
      // Create a newNote object
      const newNote = {};
      if (title) { newNote.title = title };
      if (desc) { newNote.description = desc};
      if (tag) { newNote.tag = tag };

      // Find the note to be updated and update 
      // not nessaary below code of 3 code for validation use only
      let note = await Notes.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found") }

      if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
      res.json({ note });
  } catch (error) {
    console.log({ message: "get all users invalid" });
  }
});


app.delete("/delete/:id", fetchall, async (req, res) => {
  try {
            // Find the note to be delete and delete it
            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }
    
            // Allow deletion only if user owns this Note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed");
            }
    
            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ "Success": "Note has been deleted", note: note });
    
  } catch (error) {
    console.log({ message: "get all users invalid" });
  }
});
app.listen(port, () => {
  console.log(`Note app listening on port ${URL}`);
});
