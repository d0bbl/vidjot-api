const { throwError } = require("../../utilities/response");
const IdeaModel = require("../models/idea.model");

module.exports = {
  count : async (res) => {
    try {
      return await IdeaModel.find({status: "public"}).countDocuments();
    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },
  getAll : async ( pageOptions, res) => {
    try {
      const { sort, limit } = pageOptions;
      const ideas = await IdeaModel.find({status: "public"}, 'title details createdAt').populate({path: "user", select: "name -_id"})

      .sort(sort)
      .lean();

      return ideas;
    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },
  post : async (newIdea, res) => {
    try {
      return await new IdeaModel(newIdea).save();
    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },
  show : async ( id, data, res ) => {
    try {
      const {_id: userId} = data;
      console.log(userId);
      const idCheck = await IdeaModel.findOne({_id: id}, "-__v").lean();
      console.log(idCheck);
      if ( !idCheck ) {
       throwError( 404, IdeaModel.INVALID_ID_IDEA_MSG );
      }
      if ( userId == idCheck.user) {
          delete idCheck.user;
          return idCheck;
      }
      if (idCheck.status == "public") {
          delete idCheck.user;
          return idCheck;
      }
        throwError(409, "Not Authorized");

    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },

  personal : async ( pageOptions, userId, res ) => {
    try {
      const {status, sort} = pageOptions;
      const {_id: id} = userId;
      return await IdeaModel.find({user: id}, "-user").where("status").equals(status).sort(sort).lean();

    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },

  update : async ( _id, constraint, update, res ) => {
    try {
      const check = await IdeaModel.findOne(constraint).lean();
      if ( !check ) {
        throwError( 404, IdeaModel.INVALID_ID_IDEA_MSG );
      }

      // if(check.user != _id) {
      // throwError(409, "Not Authorized");
      // }
      return await IdeaModel.findOneAndUpdate(constraint, update, { returnOriginal: false }).where("user").equals(_id).lean();

    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },

  delete : async ( constraint, id, res ) => {
    try {
      const checkdel = await IdeaModel.findOne(constraint).lean();

      if(checkdel.user != id) {
      throwError(409, "Not Authorized");
      }

      const idea = await IdeaModel.deleteOne( constraint );

      if ( !idea ) {
       throwError( 404, IdeaModel.INVALID_ID_IDEA_MSG );
      }
      return idea;
    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }

  }
}
