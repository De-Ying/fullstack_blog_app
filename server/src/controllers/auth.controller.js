import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

dotenv.config();

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUserNameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUserNameNotUnique ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

export default {
  async signup(req, res) {
    try {
      let { fullname, email = "", password } = req.body;

      // Validate user data from the frontend
      if (fullname.length < 3) {
        return res
          .status(403)
          .json({ errors: "Fullname must be at least 3 letters long" });
      }

      if (!email.length) {
        return res.status(403).json({ errors: "Enter Email" });
      }

      if (!emailRegex.test(email)) {
        return res.status(403).json({ errors: "Email is invalid" });
      }

      if (!passwordRegex.test(password)) {
        return res.status(403).json({
          errors:
            "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase let!",
        });
      }

      // Hash the password using bcrypt
      const hash = bcrypt.hashSync(password, 10);

      // Generate a unique username
      const username = await generateUsername(email);

      // Create a new User object
      const user = new User({
        personal_info: { fullname, email, password: hash, username },
      });

      // Save the user to the database
      const savedUser = await user.save();

      // Return the response with the formatted user data
      return res.status(200).json(formatDataToSend(savedUser));
    } catch (error) {
      if (error.code === 11000) {
        return res.status(500).json({ error: "Email already exists" });
      }

      return res.status(500).json({ error: error.message });
    }
  },

  async signin(req, res) {
    try {
      let { email, password } = req.body;

      const user = await User.findOne({ "personal_info.email": email });

      if (!user) {
        return res.status(403).json({ error: "Email not found!" });
      }

      const result = await bcrypt.compare(
        password,
        user.personal_info.password
      );

      if (!result) {
        return res.status(403).json({ error: "Incorrect password" });
      }

      return res.status(200).json(formatDataToSend(user));
    } catch (error) {
      console.log(error);
      return res
        .status(403)
        .json({ error: "Error occurred while logging in, please try again" });
    }
  },
};
