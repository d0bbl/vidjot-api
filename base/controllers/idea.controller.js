const catchAsync = require('../../utilities/catchAsync');
const IdeaService = require('../services/idea.service');
const { catchResponse, successResponse, dataParser } = require('../../utilities/response');
const IdeaModel = require('../models/idea.model');

exports.getIdeas = catchAsync( async ( req, res, next ) => {

    try {

        const pageOptions = {
            limit: (req.query && parseInt(req.query.limit, 10)) || "100",
            sort: (req.query && req.query.sort) || '-createdAt'
        };

        const ideas = await IdeaService.getAll( pageOptions, res );
        const count = await IdeaService.count(res);

        if (ideas) {
          return dataParser(res, 200, "List of public ideas", ideas, count);
        }
          return res.json({message: `No user with a public idea exists yet`});

    } catch (e) {

        return catchResponse(res, e);

    }

})

exports.postIdea = catchAsync( async (req, res, next) => {

  try {
    const{ _id: id } = req.decoded.user;

    const newIdea = req.body;
    if (!newIdea.user) {
    newIdea.user = id;
    }

    console.log(newIdea);
    const idea = await IdeaService.post(newIdea, res);

    return dataParser(res, 200, IdeaModel.CREATED_IDEA_MSG, idea);

  } catch (e) {
    return catchResponse(res, e);
  }

})

exports.showIdea = catchAsync( async ( req, res, next) => {

  try{

      const { ideaId: id } = req.params;

      // const id = {
      //     _id : ideaId
      // };

      // const status = req.query.status || "public";

      const shownIdea = await IdeaService.show(
          id,
          req.decoded.user,
          res
      );

      return dataParser(res, 200, IdeaModel.GET_IDEA_MSG, shownIdea);

  } catch (e) {

      return catchResponse(res, e);

  }
})

exports.myIdeas = catchAsync( async ( req, res, next) => {

  try{

      const pageOptions = {
        status: (req.body.status) || "private",
        sort: (req.query && req.query.sort) || '-createdAt'
      }

      const idea = await IdeaService.personal(
          pageOptions,
          req.decoded.user,
          res
      );
      if (idea == "") {
        return dataParser(res, 200, `You are yet to add a ${pageOptions.status} idea`);
      }
      if (idea) {
        return dataParser(res, 200, IdeaModel.GET_IDEA_MSG, idea);
      }

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

    const {_id} = req.decoded.user;

    const updated = await IdeaService.update( _id, constraint, update, res);
    if(!updated) {
      return res.json({message: `failed to update idea`});
    }
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

    let id = req.decoded.user._id || req.body.user;

    const deletion = await IdeaService.delete(constraint, id, res);

    return dataParser(res, 200, IdeaModel.DELETED_IDEA_MSG);

  } catch (e) {

    return catchResponse(res, e);

  }

})
