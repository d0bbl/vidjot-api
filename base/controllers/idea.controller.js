const catchAsync = require('../../utilities/catchAsync');
const IdeaService = require('../services/idea.service');
const { catchResponse, successResponse, dataParser } = require('../../utilities/response');
const IdeaModel = require('../models/idea.model');

exports.getIdeas = catchAsync( async ( req, res, next ) => {

    try {

        const pageOptions = {
            limit: (req.query && parseInt(req.query.limit, 10)) || 10,
            sort: (req.query && req.query.sort) || '-createdAt'
        };

        const constraint = {
          status: "public"
        };

        const ideas = await IdeaService.getAll( constraint, res, pageOptions );
        const count = await IdeaService.count(constraint, res);

        return dataParser(
            res,
            200,
            IdeaModel.GET_IDEA_MSG,
            ideas,
            count
        );


    } catch (e) {

        return catchResponse(res, e);

    }

})

exports.postIdea = catchAsync( async (req, res, next) => {

  try {

    const newIdea = req.body;
    const idea = await IdeaService.post(newIdea, res);

    return dataParser(res, 200, IdeaModel.CREATED_IDEA_MSG, idea);

  } catch (e) {
    return catchResponse(res, e);
  }

})

exports.showIdea = catchAsync( async ( req, res, next) => {

  try{

      const { ideaId } = req.params;

      const constraint = {
          _id : ideaId
      };

      const idea = await IdeaService.show(
          constraint,
          req.body,
          res
      );

      return dataParser(res, 200, IdeaModel.GET_IDEA_MSG, idea);

  } catch (e) {

      return catchResponse(res, e);

  }
})

exports.updateIdea = catchAsync( async ( req, res, next) => {

  try {

    const { ideaId } = req.params;
    const update = req.body;

    const constraint = {
        _id : ideaId
    };

    const updated = await IdeaService.update( constraint, update, res);

    return dataParser(res, 200, IdeaModel.UPDATED_IDEA_MSG, updated);

  } catch (e) {

      return catchResponse(res, e);

  }
})

exports.deleteIdea = catchAsync( async ( req, res, next) => {

  try {

    const { ideaId } = req.params;

    const constraint = {
        _id : ideaId
    };

    const deletion = await IdeaService.delete(constraint, req.body, res);

    return dataParser(res, 200, IdeaModel.DELETED_IDEA_MSG);

  } catch (e) {

    return catchResponse(res, e);

  }

})
