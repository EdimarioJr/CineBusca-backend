import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "The first name is obrigatory!"],
    unique: [true, "Esse nome já foi cadastrado!"],
    trim: true
  },
  password: {
    type: String,
    required: [true, "The second name is obrigatory!"],
  },
  watchlist: [String],
  reviews: [{
    idMovie: {
      type: Number,
      required: [true, "The id of the movie is obrigatory!"]
    },
    review: {
      type: String,
      required: [true, "The review can't be null!"]
    }
  }]
});

export default mongoose.model("User", UserSchema);
