const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ideaApiSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "public"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, { timestamps: true });

const IdeaModel = mongoose.model("Idea", ideaApiSchema);

IdeaModel.GET_IDEA_MSG = 'Ideas fetched successfully';
IdeaModel.SHOW_IDEA_MSG = 'Idea fetched successfully';
IdeaModel.CREATED_IDEA_MSG = 'Idea created successfully';
IdeaModel.UPDATED_IDEA_MSG = 'Idea updated successfully';
IdeaModel.DELETED_IDEA_MSG = 'Idea deleted successfully';
IdeaModel.INVALID_ID_IDEA_MSG = 'An Idea with that id doesnt exists';

module.exports = IdeaModel;
