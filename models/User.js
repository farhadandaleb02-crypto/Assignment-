import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
});

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;