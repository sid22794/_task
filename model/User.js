const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// // creating a virtual schema for task refrence
UserSchema.virtual("post", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});
//

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
