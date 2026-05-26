const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { mobile, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ mobile, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.json({ message: "Incorrect password or mobile" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or mobile" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User logged in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};