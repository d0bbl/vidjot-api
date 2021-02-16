const express = require('express');
const UserController = require("../../controllers/user.controller");
const {validate} = require("../../requestvalidations/auth.request");
const {ifInvalid} = require("../../middleware/validation.middleware");
const jwtV = require("../../middleware/verifyJWT.middleware");

const router = express.Router();

router.post('/user/login', [ validate("login"), ifInvalid ], UserController.userLogin);

router.get("/users", jwtV, UserController.getUsers);
// , [ jwtV, validate("show"), ifInvalid ]
router.post("/user/register", [ validate("register"), ifInvalid ], UserController.registerUser);

router.put("/user/:userId", [ jwtV, validate("profileUpdate"), ifInvalid ], UserController.updateProfile);
// [ validate("post"), ifInvalid ]
router.delete("/user/:userId", [ jwtV, validate("delete"), ifInvalid ], UserController.deleteUser);


module.exports = router;
