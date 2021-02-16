const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  titel: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// export model post with PostSchema
module.exports = mongoose.model("post", PostSchema);
