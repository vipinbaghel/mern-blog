const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const login = async (req, res) => {
  try {
    const { username, password } = req.body;
   
    // accessing the cookies
    // console.log(req.cookies);
    
    
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      console.log('inside if ');
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials " });
    }

    //Generate a Jwt token and
    //Set the token as a cookie
    jwt.sign({username, userId: userDoc._id }, "vipin", {}, (err, token) =>{
      if(err) throw err;
      res.cookie('token', token).json({id: userDoc._id, username})
    });

    
   
    
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exist" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const logout = (req,res) => {
  res.cookie('token', '').json('ok');
}

const getProfile = (req, res) => {

  const {token} = req.cookies;

  // console.log('getProfile me token ki value', token);
  if(token) {

    jwt.verify(token, 'vipin', {}, (err, info)=>{
      if(err) throw err;
      res.json(info);
    });
  }
  
  
  
}

module.exports = {
  login,
  register,
  logout,
  getProfile,
};
