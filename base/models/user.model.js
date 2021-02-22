const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  bio:{
    type: String,
  },
  status:{
    type: String,
    enum: ["public", "private", "unpublished"],
    default: "private"
  }
}, { timestamps: true });

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 8, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// userSchema.post("findOne", {query: false, document: true}, function(error, doc, next) {
//
//   next();
// });

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
