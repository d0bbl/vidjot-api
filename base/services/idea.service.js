const { throwError } = require("../../utilities/response");
const IdeaModel = require("../models/idea.model");

module.exports = {
  count : async (criteria, res) => {
    try {
      return await IdeaModel.find(criteria).countDocuments();
    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },
  getAll : async ( criteria, res, pageOptions) => {
    try {
      const { sort, limit } = pageOptions;
      return await IdeaModel.find({criteria}, "title details")
      .sort(sort)
      .limit(limit);
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
  show : async ( constraint, userId, res ) => {
    try {
      const {user} = userId;
      const idCheck = await IdeaModel.findById(constraint).select("user");
      if ( !idCheck ) {
       throwError( 404, IdeaModel.INVALID_ID_IDEA_MSG );
      }
      const idea = await IdeaModel.findOne(constraint).select("-_id -user").lean();
      if ( user == idCheck.user) {
          return idea;
      }
      if (idCheck.status == "public") {
        return idea;
      }
        throwError(409, "Not Authorized");

    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },

  update : async ( constraint, update, res ) => {
    try {
      const check = await IdeaModel.findOne(constraint);

      if(check.user !== update.user) {
      throwError(409, "Not Authorized");
      }

      const idea = await IdeaModel.updateOne(constraint, update, { new: true });

      if ( !idea ) {
       throwError( 404, IdeaModel.INVALID_ID_IDEA_MSG );
      }
      return idea;
    } catch (e) {
      throwError(e.status, e.message || e.toString());
    }
  },

  delete : async ( constraint, id, res ) => {
    try {
      const checkdel = await IdeaModel.findOne(constraint);

      if(checkdel.user !== id.user) {
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
