const express = require('express');
const IdeaController = require("../../controllers/idea.controller");
const {validate} = require("../../requestvalidations/idea.request");
const {ifInvalid} = require("../../middleware/validation.middleware");
const jwtV = require("../../middleware/verifyJWT.middleware");

const router = express.Router();

router.get('/ideas', IdeaController.getIdeas);

router.get("/ideas/:ideaId", [ jwtV, validate("show"), ifInvalid ], IdeaController.showIdea);

router.get("/ideas/myIdeas", [ jwtV, validate("myIdeas"), ifInvalid ], IdeaController.myIdeas);

router.post("/ideas/post", [ jwtV, validate("post"), ifInvalid ], IdeaController.postIdea);

router.put("/ideas/:ideaId", [ jwtV, validate("update"), ifInvalid ], IdeaController.updateIdea);

router.delete("/ideas/:ideaId", [ jwtV, validate("delete"), ifInvalid ], IdeaController.deleteIdea);


module.exports = router;
