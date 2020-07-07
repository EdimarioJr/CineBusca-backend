import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "The first name is obrigatory!"],
    unique: [true, "Esse nome já foi cadastrado!"]
  },
  password: {
    type: String,
    required: [true, "The second name is obrigatory!"],
  },
  watchlist: [String],
});

export default mongoose.model("User", UserSchema);
