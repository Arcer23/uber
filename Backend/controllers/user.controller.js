const userModel = require("../models/user.model.js");
const userService = require("../services/user.services.js");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  if (!fullname || !fullname.firstname || !fullname.lastname) {
    return res
      .status(400)
      .json({ error: "Full name with firstname and lastname is required." });
  }

  try {
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();
    return res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Something went wrong while registering the user." });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(500)
      .json({ error: "Please Enter the Email And the Password" });
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) return res.status(400).json("Invlaid Username or Password");
  const matchPassword = await user.comparePassword(password);
  if (!matchPassword)
    return res.status(400).json("Invalid Password Or Username");
  const token = user.generateAuthToken();
  res.status(200).json({ token, user });
};

module.exports.getAllUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userModel.find();
    if (!user) return res.status(400).json({ message: "Database is Empty" });
    return res.status(201).json({ user, message: "User Fetched Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while registering the user." });
  }
};

module.exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.id;
  const userData = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, userData, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
