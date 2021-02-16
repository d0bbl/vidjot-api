const { validationResult } = require('express-validator');


module.exports = {
  ifInvalid: (req, res, next) => {
  const errors = validationResult(req);
  let errMessage = '';
  if (errors && errors.array() && errors.array().length > 0) {
    errMessage = errors.array()[0].msg;
  }

  if (!errors.isEmpty()) {
    res.locals.errorMessage = errMessage;
    return res.status(422).send({
      success: false,
      error: `Your request has some validation errors. ${errMessage}`,
      data: errors.array(),
    });
  }

  next();
  }
}
