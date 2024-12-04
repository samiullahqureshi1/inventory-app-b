// // Import Model
// import { User } from "../models/user_model.js";

// // Import Packages
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// // Import Validation
// import {
//   signup_validation,
//   login_validation,
// } from "../utils/validations/user_validation.js";

// // Hashing Password
// const secure_password = async (password) => {
//   try {
//     const hash_password = await bcryptjs.hash(password, 10);
//     return hash_password;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// // SignUp

// const Signup = async (req, resp) => {
//   try {
//     const { error } = signup_validation(req.body);
//     if (error) {
//       return resp.status(400).send({ message: error.details[0].message });
//     }

//     const existing_user = await User.findOne({ email: req.body.email });
//     if (existing_user) {
//       return resp.status(400).send({ message: `Email already exists` });
//     }

//     const hashed_password = await secure_password(req.body.password);

//     const user = new User({
//       ...req.body,
//       password: hashed_password,
//     });

//     const save_user = await user.save();

//     const token = jwt.sign(
//       { id: save_user._id, email: save_user.email },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "30d" }
//     );

//     return resp.status(200).send({
//       message: `Signup successfully`,
//       user: save_user,
//       token: token,
//     });
//   } catch (error) {
//     return resp.status(400).send(error.message);
//   }
// };

// // LogIn
// const Login = async (req, resp) => {
//   try {
//     const { error } = login_validation(req.body);
//     if (error) {
//       return resp.status(400).send({ message: error.details[0].message });
//     }

//     const { email, password } = req.body;

//     const data = await User.findOne({ email: email });
//     if (!data) {
//       return resp.status(400).send({ message: `Email not exists` });
//     }

//     const check_password = await bcryptjs.compare(password, data.password);
//     if (!check_password) {
//       return resp.status(400).send({ message: `Invalid Password` });
//     }

//     const token = jwt.sign(
//       { id: data._id, email: data.email },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "30d" }
//     );

//     return resp.status(200).send({
//       message: `Login successfully`,
//       user: data,
//       token: token,
//     });
//   } catch (error) {
//     return resp.status(400).send(error.message);
//   }
// };

// export { Signup, Login };

import { authModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";
import { logInValidationSchema, regiterValidationSchema } from "../utils/validations/user_validation.js";


const createToken = (payLoad) => {
  const token = jwt.sign({ payLoad }, process.env.SECRET_KEY, {
    expiresIn: "175d",
  });
  return token;
};

 const signIn = async (req, res) => {
  try {
    const { error, value } = logInValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }
    const { email, password } = req.body;
    // checking email already exist
    const emailExist = await authModel.findOne({
      email: email,
    });

    if (!emailExist) {
      throw new Error("user does not exist with this email");
    }
    // Compare passwords
    const isMatch = await emailExist.comparePassword(password);
    if (!isMatch) {
      throw new Error("password does not match");
    }
    const token = createToken({ _id: emailExist._id });
    res.send({
      message: "successfully logIn",
      token,
      data: emailExist,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};






 const signUp = async (req, res) => {
  try {
    const { error, value } = regiterValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // checking email already exist
    const userExist = await authModel.findOne({
      email: req.body.email,
    });

    if (userExist) {
      throw new Error("user already exist with this email");
    }

    // create new user
    const newUser = new authModel(req.body);
    const saveUser = await newUser.save();
    const token = createToken({ _id: saveUser._id });
    res.send({
      message: "successfully register",
      token,
      data: saveUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


// const signIn = async (req, res) => {
//   try {
//     const { error, value } = logInValidationSchema.validate(req.body);

//     if (error) {
//       throw new Error(error.details[0].message);
//     }

//     const { email, password } = req.body;
    
//     // Check if email exists in the database
//     const emailExist = await authModel.findOne({
//       email: email,
//     });

//     if (!emailExist) {
//       throw new Error("User does not exist with this email");
//     }

//     // Compare the password
//     const isMatch = await emailExist.comparePassword(password);
//     if (!isMatch) {
//       throw new Error("Password does not match");
//     }

//     // Include the role in the token
//     const token = createToken({ _id: emailExist._id, role: emailExist.role });

//     res.send({
//       message: "Successfully logged in",
//       token,
//       data: emailExist,
//     });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };


// const signUp = async (req, res) => {
//   try {
//     const { error, value } = regiterValidationSchema.validate(req.body);

//     if (error) {
//       throw new Error(error.details[0].message);
//     }

//     // Validate the role
//     const validRoles = ["sales", "production", "admin"];  // Added 'admin' to valid roles
//     if (!validRoles.includes(req.body.role)) {
//       throw new Error(`Invalid role. Allowed roles are: ${validRoles.join(", ")}`);
//     }

//     // Check if email already exists
//     const userExist = await authModel.findOne({ email: req.body.email });
//     if (userExist) {
//       throw new Error("User already exists with this email");
//     }

//     // Create new user
//     const newUser = new authModel(req.body);
//     const saveUser = await newUser.save();

//     // Include role in the token
//     const token = createToken({ _id: saveUser._id, role: saveUser.role });

//     res.send({
//       message: "Successfully registered",
//       token,
//       data: saveUser,
//     });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };




export const updateUserTags = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newTag = req.query.query;

    const updatedUser = await authModel.findByIdAndUpdate(
      userId,
      { $push: { tags: newTag } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).send({ message: "no logedIn user" });
    }

    res.status(200).send({
      message:'added to the tags'
    });
  } catch (error) {
    console.error("Error updating user tags:", error);
    res.status(400).send({ message: error.message });
  }
};


export { signUp, signIn };
