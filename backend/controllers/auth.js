import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateTokenandSetCookie } from "../lib/utlis/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must atleat 6 characters long" });
    }

    //hashing
    const salt = bcrypt.genSaltSync();
    const hashPwd = bcrypt.hashSync(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPwd,
    });

    if (newUser) {
      generateTokenandSetCookie(newUser._id, res);
      await newUser.save();

      const {
        _id,
        fullname,
        username,
        email,
        followers,
        following,
        profileImg,
        coverImg,
      } = newUser;

      res.status(201).json({
        _id,
        fullname,
        username,
        email,
        followers,
        following,
        profileImg,
        coverImg,
      });
    } else {
      res.status(400).json({ json: "Invalid userdata" });
    }
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPwsdCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPwsdCorrect) {
      return res.status(400).json({ error: "Invalid credentails" });
    }

    generateTokenandSetCookie(user._id, res);

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out sucess" });
  } catch (error) {
    console.log("Error in logout", error.message);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getME", error.message);
    res.status(500).json({ error: "Internal Server Error!!" });
  }
};
