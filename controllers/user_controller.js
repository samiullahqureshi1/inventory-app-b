// Import Model
import { User } from "../models/user_model.js";

// Import Packages
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Import Validation
import {
  signup_validation,
  login_validation,
} from "../utils/validations/user_validation.js";

// Hashing Password
const secure_password = async (password) => {
  try {
    const hash_password = await bcryptjs.hash(password, 10);
    return hash_password;
  } catch (error) {
    console.log(error.message);
  }
};

// SignUp

const Signup = async (req, resp) => {
  try {
    const { error } = signup_validation(req.body);
    if (error) {
      return resp.status(400).send({ message: error.details[0].message });
    }

    const existing_user = await User.findOne({ email: req.body.email });
    if (existing_user) {
      return resp.status(400).send({ message: `Email already exists` });
    }

    const hashed_password = await secure_password(req.body.password);

    const user = new User({
      ...req.body,
      password: hashed_password,
    });

    const save_user = await user.save();

    const token = jwt.sign(
      { id: save_user._id, email: save_user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    return resp.status(200).send({
      message: `Signup successfully`,
      user: save_user,
      token: token,
    });
  } catch (error) {
    return resp.status(400).send(error.message);
  }
};

// LogIn
const Login = async (req, resp) => {
  try {
    const { error } = login_validation(req.body);
    if (error) {
      return resp.status(400).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const data = await User.findOne({ email: email });
    if (!data) {
      return resp.status(400).send({ message: `Email not exists` });
    }

    const check_password = await bcryptjs.compare(password, data.password);
    if (!check_password) {
      return resp.status(400).send({ message: `Invalid Password` });
    }

    const token = jwt.sign(
      { id: data._id, email: data.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    return resp.status(200).send({
      message: `Login successfully`,
      user: data,
      token: token,
    });
  } catch (error) {
    return resp.status(400).send(error.message);
  }
};

export { Signup, Login };
