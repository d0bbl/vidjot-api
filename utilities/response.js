const { check, validationResult } = require('express-validator');

module.exports = {
  validate : (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array(),
      });
    }
  },
  errorResponse : (res, status, message = " ") => {
    return res.status(status).json({
      success: false,
      message,
    });
  },
  successResponse : (res, status, message = " ", data = " ") => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  },
  catchResponse : (res, e) => {
    return res.status(e.status || 500).json({
      success: false,
      message: e.message || JSON.stringify(e),
    });
  },
  throwError : (status, message) => {
    const err = {
      status,
      message
    };
    throw err;
  },
  dataParser : (res, status, message, data, count) => {
    return res.status(status).json({
      success: true,
      message,
      data,
      count,
    });
  }
}
