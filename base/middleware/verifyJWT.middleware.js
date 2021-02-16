const jwt = require("jsonwebtoken");
const {errorResponse} = require("../../utilities/response");

module.exports =
(req, res, next) => {
  try {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    errorResponse(res, 403, 'No token provided');
  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.decoded = decoded;
  next();

  } catch (error) {
  return res.status(401).json({message: "Auth failed"});
  }
};
