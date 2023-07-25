const ErrorResponse = require("../utils/ErrorResponse");
const {
  validateSignup,
  validateLogin,
  validateResetPassword,
} = require("../models/auth.model");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  giveAdminAccess,
  validateToken,
  getUserByID,
  getAllUsers,
  aboutMe,
} = require("../service/auth.service");

const asyncHandler = require("../middleware/asyncHandler.middleware");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { error } = validateSignup.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }
  await signup(req.body).then((result) =>
    res.status(201).json({ payload: result })
  );
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { error } = validateLogin.validate(req.body);
  if (error) {
    return next(new ErrorResponse(error.message, 400));
  }
  await login(req.body).then((result) => res.json({ payload: result , message: "Login Successful"}));
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  await forgotPassword(req.params.username).then((result) =>
    res.json({ resetToken: result, expiresIn: "15 min" })
  );
});

exports.logoutUser = asyncHandler(async (req, res) => {
  //clear jwt token To Do
  res.json({ message: "Logout Successful" }); 
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // const { error } = validateResetPassword.validate(req.body);
  // if (error) {
  //   return next(new ErrorResponse(error.message, 400));
  // }
  console.log("req.body.resetToken -->", req.body.resetToken);
  await resetPassword(req.body.resetToken, req.body.password).then(
    (result) => {
      res.status(204).json({ payload: result });
    }
  );
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  await getAllUsers().then((result) => res.json({ payload: result }));
});

exports.getUserById = asyncHandler(async (req, res) => {
  await getUserByID(req.params.userId).then((result) =>
    res.json({ payload: result })
  );
});

exports.giveAdminAccess = asyncHandler(async (req, res) => {
  await giveAdminAccess(req.params.loginId).then((result) => {
    res.status(201).json({ payload: result , message : "Admin Access Granted" });
  });
});

exports.validateToken = asyncHandler(async (req, res) => {
  const header = req.headers["authorization"];
  if (!header) {
    throw new ErrorResponse("Invalid access, no token provided", 401);
  }
  const token = header.slice(7);
  res.json({ payload: validateToken(token) });
});

exports.aboutMe = asyncHandler(async (req, res) => {
  const header = req.headers["authorization"];
  if (!header) {
    throw new ErrorResponse("Invalid access, no token provided", 401);
  }
  await aboutMe(header.slice(7)).then((result) => {
    res.json({ payload: result });
  });
});
