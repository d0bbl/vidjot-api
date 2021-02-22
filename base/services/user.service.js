const { throwError, errorResponse } = require("../../utilities/response");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (userDetail, res) => {
    try {
      const {email, password} = userDetail;
      const user = await UserModel.findOne({ email });
        if(!user) {
          throwError(409, "User not registered");
        }
        if(user) {
          const userdoc = user.comparePassword(password);
          if(!userdoc) {
            throwError(409, "Invalid credentials");
          }
          return {
            profile: user,
            token: createToken(user)
          }
        }
    } catch (e) {
      throwError(e.status, e.message || e.toString())
    }
  },

  register: async (newUser, res) => {
    try {

      const {email} = newUser;

      const checkUser = await UserModel.findOne({email});
      if(checkUser) {
        throwError(409, "A user wih this email exists");
      }
      const user = new UserModel(newUser);
      await user.save();
      return user;
    } catch (e) {
      throwError(e.status, e.message || e.toString())
    }
  },

  getUsers: async (pageOptions, res) => {

    try {
      const {limit, sort} = pageOptions;
      const user = await UserModel.find({status : "public"})
      // .limit(limit)
      .sort(sort)
      .select("-_id name bio")
      .lean();

      return user;

      // const users = await UserModel.find({status : "public"}, "name, details").lean();
      // if (!users) {
      //   return res.json({message: `No user with a public status exists yet`});
      // }
      //
      // return users;

    } catch (e) {
      throwError(e.status, e.message || e.toString())
    }
  },

  profileUpdate: async (constraint, updateDetails, res) => {

    try {
      // const updateProp = {};
      // for (const keys of updateDetails) {
      //   updateProp[keys.propName] = keys.value;
      // }

      return await UserModel.findByIdAndUpdate(constraint, {$set: updateDetails}, {returnOriginal: false}).select("-password");

    } catch (e) {
      throwError(e.status, e.message || e.toString())
    }
  },

  userDelete: async (constraint, res) => {
    try {
      return await UserModel.findByIdAndDelete(constraint);

    } catch (e) {
      throwError(e.status, e.message || e.toString())
    }
  }

}

const createToken = (user) => {
  delete user.password;
  return jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '5h' });
};
