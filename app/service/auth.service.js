const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userData } = require("../models/auth.model");
const ErrorResponse = require("../utils/ErrorResponse");

exports.signup = async (userDetails) => {

  console.log("User Details", userDetails);
  
  const encryptedPassword = await bcrypt.hash(userDetails.password, 10);
  const tempUserData = new userData({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: userDetails.email,
    loginId: userDetails.loginId,
    password: encryptedPassword,
    gender: userDetails.gender,
    contactNumber: userDetails.contactNumber,
  });
  const data = await tempUserData.save();
  return `New user created successfully with username ${data.loginId}`;
};

exports.login = async (loginDetails) => {
  const user = loginDetails.email
    ? await userData.findOne({ email: loginDetails.email })
    : await userData.findOne({ loginId: loginDetails.loginId });

  if (user === null) {
    throw new ErrorResponse("No User Found", 404);
  }

  const match = await bcrypt.compare(loginDetails.password, user.password);
  if (match) {
    const name = user.firstName + " " + user.lastName;
    return generateLoginToken(user.email, user.role, user._id, name);
  }
  throw new ErrorResponse("Invalid Password", 401);
};

exports.forgotPassword = async (username) => {
  const user = await userData.findOne({
    $or: [{ loginId: username }, { email: username }],
  });
  if (user === null) {
    throw new ErrorResponse("No user exists", 404);
  }
  return generatePasswordResetToken(username);
};

exports.resetPassword = async (resetToken, newPassword) => {
  const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_KEY);
  console.log("decoded -->", decoded);
  const user = await userData.findOne({ loginId: decoded.username });
  console.log("user -->", user);
  const match = await bcrypt.compare(newPassword, user.password);
   console.log("match -->", match);
  if (match) {
    throw new ErrorResponse("Password can not be same as previous", 400);
  }
  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  await userData.findByIdAndUpdate(user._id, { password: encryptedPassword });
  return `Password updated for username ${user.loginId}`;
};

exports.giveAdminAccess = async (loginId) => {
  const user = await userData.findOne({ loginId: loginId });
  user.role = "ADMIN";
  await user.save();
  return `Admin access provided to ${loginId}`;
};

exports.validateToken = (token) => {
  const privateKey = process.env.PRIVATE_KEY;
  return jwt.verify(token, privateKey);
};

exports.getUserByID = async (id) => {
  return await userData.findById(id).select("-password -role");
};

exports.getAllUsers = async () => {
  return await userData.find().select("-password");
};

exports.aboutMe = async (token) => {
  const userEmail = this.validateToken(token)?.email;
  return userData.findOne({ email: userEmail }).select("-password");
};

function generateLoginToken(emailId, role, id, name) {
  const privateKey = process.env.PRIVATE_KEY;
  const validityTime = process.env.VALIDITY_TIME;
  const data = { email: emailId, role: role, _id: id, name: name };
  return jwt.sign(data, privateKey, {
    algorithm: "HS512",
    expiresIn: validityTime * 60 * 60,
  });
}

function generatePasswordResetToken(username) {
  const resetTokenKey = process.env.RESET_TOKEN_KEY;
  const data = {
    username: username,
    payload: Math.random().toString(36).slice(-8),
  };
  return jwt.sign(data, resetTokenKey, { expiresIn: 0.25 * 60 * 60 });
}
