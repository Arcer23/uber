const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller.js");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Character Must Be Atleast 3 "),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password Must Be Atleast 6 characters"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password Required"),
  ],
  userController.loginUser
);

router.get("/getallusers", [], userController.getAllUsers);
router.post(
  "/updateuser/:id",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Character Must Be Atleast 3"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password Must Be Atleast 6 characters"),
  ],
  userController.updateUser
);
module.exports = router;
