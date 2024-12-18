import mongoose, { Schema } from "mongoose";

const UserModel = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  histroy: [
    {
      type: Schema.Types.ObjectId,
      ref: "History",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserModel);
export default User;
