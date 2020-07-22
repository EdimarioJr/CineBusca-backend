import User from "../db/Model/User";
import checkToken from "../utils/checkToken";

const watchlistController = {
  index: async (req, res) => {
    // when the user tries to access the watchlist, the jwt will be required
    // the token will be sended from the front end in the headers of the requisition
    // verifying the authenticity of the token
    let resultCheck = checkToken(req.headers.authorization);
    // if the token is cool, we will use the id in the payload of the token to make a request to the DB
    if (resultCheck.auth) {
      let userW = await User.findOne({ _id: resultCheck.id }, (err) => {
        if (err)
          return res.json({
            message: "User not found!",
            watchlist: false,
          });
      });
      userW = userW.watchlist;
      return res.json({ message: "User found!", watchlist: userW });
    } else return res.json(resultCheck);
  },

  // adds a new movie to the watchlist
  store: async (req, res) => {
    const { idMovie } = req.body;
    let resultCheck = checkToken(req.headers.authorization);
    if (resultCheck.auth) {
      await User.updateOne(
        { _id: resultCheck.id },
        // addToSet makes a push operation in a property of the model that is a array
        { $addToSet: { watchlist: idMovie } },
        (err) => {
          if (err)
            return res.json({
              message: "Error adding in the watchlist",
              addWatchlist: false,
              err: err,
            });
          return res.json({
            message: "Added with success in the watchlist",
            addWatchlist: true,
          });
        }
      );
    } else return res.json(resultCheck);
  },

  destroy: async (req, res) => {
    const idMovie = req.query.idMovie
    let resultCheck = checkToken(req.headers.authorization);
    if (resultCheck.id) {
      await User.updateOne(
        { _id: resultCheck.id },
        { $pull: { watchlist: idMovie} },
        (err) => {
          if (err)
            return res.json({
              message: "Error removing from the watchlist",
              remove: false,
              err: err,
            });
          return res.json({
            message: "Removed with success from the watchlist",
            remove: true,
          });
        }
      );
    } else return res.json(resultCheck);
  },
};

export default watchlistController;
