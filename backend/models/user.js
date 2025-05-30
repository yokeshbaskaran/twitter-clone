import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],

    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
