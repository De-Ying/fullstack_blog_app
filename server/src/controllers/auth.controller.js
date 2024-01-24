import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const saveUserToDatabase = async (user) => {
  return user.save();
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUserNameNotUnique = await User.exists({
    "personal_info.username": username,
  });

  if (isUserNameNotUnique) {
    username += nanoid().substring(0, 5);
  }

  return username;
};

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_ACCESS_KEY);
};

const formatUserResponse = (user) => {
  return {
    access_token: createAccessToken(user._id),
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const handleErrors = (res, error, status, message) => {
  console.error(error);
  return res.status(status).json({ errors: message });
};

const validateUserInput = (fullname, email, password) => {
  const isBlank = (value) => !value.trim();
  const isInvalidEmail = (value) => !emailRegex.test(value);
  const isInvalidPassword = (value) => !passwordRegex.test(value);

  const validations = [
    { condition: isBlank(fullname), message: "Fullname is not blank" },
    {
      condition: fullname.length < 3,
      message: "Fullname must be at least 3 letters long",
    },
    { condition: isBlank(email), message: "Email is not blank" },
    { condition: isInvalidEmail(email), message: "Email is invalid" },
    { condition: isBlank(password), message: "Password is not blank" },
    {
      condition: isInvalidPassword(password),
      message:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase, and 1 uppercase letter",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : null;
};

export default {
  async signup(req, res) {
    try {
      const { fullname, email, password } = req.body;

      // Validate user data from the frontend
      const validationError = validateUserInput(fullname, email, password);

      if (validationError) {
        return res.status(403).json({ errors: validationError });
      }

      const emailExists = await User.exists({ "personal_info.email": email });

      if (emailExists) {
        return res.status(409).json({ errors: "Email already exists" });
      }

      // Hash the password using bcrypt
      const hash = await hashPassword(password);

      // Generate a unique username
      const username = await generateUsername(email);

      // Create a new User object
      const user = new User({
        personal_info: { fullname, email, password: hash, username },
      });

      // Save the user to the database
      const savedUser = await saveUserToDatabase(user);

      // Return the response with the formatted user data
      return res.status(200).json(formatUserResponse(savedUser));
    } catch (error) {
      return handleErrors(res, error, 500, "Error occurred during signup");
    }
  },

  async signin(req, res) {
    try {
      let { email, password } = req.body;

      const user = await User.findOne({ "personal_info.email": email });

      if (!user) {
        return res.status(403).json({ errors: "Email not found!" });
      }

      if (!user.google_auth) {
        const result = await bcrypt.compare(
          password,
          user.personal_info.password
        );
  
        if (!result) {
          return res.status(403).json({ errors: "Incorrect password" });
        }
  
        return res.status(200).json(formatUserResponse(user));
      } else {
        return res.status(403).json({ errors: "Account was created using Google. Try logging in with google." });
      }

    } catch (error) {
      return handleErrors(res, error, 403, "Error occurred during signin");
    }
  },

  async googleAuth(req, res) {
    try {
      const { access_token } = req.body;

      const decodedUser = await getAuth().verifyIdToken(access_token);
      const { email, name, picture } = decodedUser;

      let user = await User.findOne({ "personal_info.email": email })
      .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

      if (user) {
        if (!user.google_auth) {
          return res.status(403).json({
            errors: "This email was signed up without google. Please log in with password to access the account",
          });
        }
      } else {
        const username = await generateUsername(email);
        user = new User({
          personal_info: { fullname: name, email, profile_img: picture, username },
          google_auth: true,
        });
  
        await user.save();
      }

      return res.status(200).json(formatUserResponse(user));
    } catch (err) {
      return res.status(500).json({ errors: "Failed to authenticate you with google. Try with some other google account" });
    }
  },
};
