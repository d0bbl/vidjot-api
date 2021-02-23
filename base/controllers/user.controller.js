const catchAsync = require('../../utilities/catchAsync');
const UserService = require('../services/user.service');
const { catchResponse, successResponse, dataParser, errorResponse } = require('../../utilities/response');
const UserModel = require('../models/user.model');

exports.userLogin = catchAsync( async ( req, res, next ) => {

    try {

        const userDetails = await UserService.login(req.body, res);
        if (userDetails) {
          return dataParser(
            res,
            200,
            userDetails
          );
        }

    } catch (e) {

        return catchResponse(res, e);

    }
})

exports.registerUser = catchAsync( async (req, res, next) => {

  try {

    const user = await UserService.register(req.body, res);
    const userDetails = await UserService.login(req.body, res);
    // if (userDetails) {
    // delete userDetails.profile.user.password;
    // }
    if (user) {
    return res.status(201).json({
      message: "User registered",
      Data: userDetails.profile,
      token: userDetails.token
    })
    }

  } catch (e) {
    return catchResponse(res, e);
  }

})

exports.getUsers = catchAsync( async ( req, res, next) => {

  try{
    const pageOptions = {
        // limit: (req.query && parseInt(req.query.limit, 10)) || 5,
        sort: (req.query && req.query.sort) || '-1'
    };

    const users = await UserService.getUsers(pageOptions, res);

    if (users) {
      return dataParser(res, 200, "List of public users", users);
    }
      return res.json({message: `No user with a public status exists yet`});

    // res.status(200).json({
    //     message: "public users",
    //       users: users.map(user => {
    //         return {
    //           name: user.name,
    //           bio: user.bio
    //           }
    //       })
    // });

  } catch (e) {

      return catchResponse(res, e);

  }
})

exports.updateProfile = catchAsync( async ( req, res, next) => {

  try {

    const { _id:  userId } = req.decoded.user;

    const updated = await UserService.profileUpdate(userId, req.body, res);
    if (!updated) {
       return errorResponse(res, 409, "Failed to update profile");
     }

    return dataParser(res, 200, updated);

  } catch (e) {

      return catchResponse(res, e);

  }
})

exports.deleteUser = catchAsync( async ( req, res, next) => {

  try {

    const { _id:  userId } = req.decoded.user;

    const deletion = await UserService.userDelete(userId || req.params.userId, res);

    if (!deletion) {
       return errorResponse(res, 409, "Failed to delete profile");
     }

    return dataParser(res, 200, "Profile deleted");

  } catch (e) {

    return catchResponse(res, e);

  }

})
