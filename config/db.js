const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://127.0.0.1:27017/webSkitters_Task",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (e) => {
    if (e) {
      console.log("error", e);
    } else {
      console.log("connected db moongoose.js ");
    }
  }
);
module.exports = mongoose;
