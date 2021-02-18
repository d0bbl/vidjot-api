const { param, body } = require('express-validator');

// let details = " ";

exports.validate = (details) => {
  switch (details) {
    case 'update_password': {
      return [
        body('current_password', 'Current Password is Required')
          .isLength({ min: 3 })
          .trim()
          .escape()
          .withMessage('Current Password must be at least 3 characters long'),
        body('password', 'Password is Required')
          .isLength({ min: 3 })
          .trim()
          .escape()
          .withMessage('New Password must be at least 3 characters long'),
        body('confirm_password', 'Confirm Password is Required')
          .isLength({ min: 3 })
          .trim()
          .escape()
          .withMessage(
            'Password Confirmation must be at least 3 characters long'
          ),
      ];
    }

    case "post": {
      return [
        body("title")
        .isString()
        .escape()
        .withMessage("Your Idea is missing a title"),
        body("details")
        .isString()
        .escape()
        .withMessage("Your Idea is missing its details"),
        body('user')
          .exists()
          .withMessage('ID is required')
          .isMongoId()
          .withMessage('ID should be a Mongo ID'),
        body("status")
        .isString()
        .withMessage("Choose to make your idea private or public"),
      ];
    }

    case 'show': {
      return [
        param('ideaId')
          .exists()
          .withMessage('ID is required')
          .isMongoId()
          .withMessage('ID should be a Mongo ID'),
          body('user')
            .exists()
            .withMessage('ID is required')
            .isMongoId()
            .withMessage('ID should be a Mongo ID'),
      ];
    }

    case 'update': {
      return [
        param('ideaId')
          .exists()
          .withMessage('ID is required')
          .isMongoId()
          .withMessage('ID should be a Mongo ID'),
        body('title').optional().isString(),
        body('details').optional().isString(),
        body('status').optional().isString(),
      ];
    }

    case 'delete': {
      return [
        param('ideaId')
          .exists()
          .withMessage('ID is required')
          .isMongoId()
          .withMessage('ID should be a Mongo ID'),
        body('user')
          .exists()
          .withMessage('ID is required')
          .isMongoId()
          .withMessage('ID should be a Mongo ID'),
      ];
    }
  }
}
