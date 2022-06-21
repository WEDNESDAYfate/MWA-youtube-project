const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 3,
  },
});

mongoose.model(
  process.env.DB_USER_MODEL,
  userSchema,
  process.env.DB_USER_COLLECTION
);
