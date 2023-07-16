const ErrorResponse = require("../utils/ErrorResponse");
const { validateToken } = require("../service/auth.service");

exports.authenticateAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      throw new ErrorResponse("Invalid access, no token provided", 401);
    const dummyToken = token.slice(7);
    const verify = validateToken(dummyToken);
    if (!verify.role.match("ADMIN")) {
      throw new ErrorResponse("Unauthorized Access", 403);
    }
    next();
  } catch (ex) {
    throw new ErrorResponse(ex.message, 401);
  }
};

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.slice(7);
    if (!token)
      throw new ErrorResponse("Invalid access, no token provided", 401);
    validateToken(token);
    next();
  } catch (ex) {
    throw new ErrorResponse(ex.message, 401);
  }
};
