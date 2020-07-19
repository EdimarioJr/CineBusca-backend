import User from "../db/Model/User";
import checkToken from "../utils/checkToken";

const reviewController = {
  create: async (req, res) => {
    const { idMovie, review } = req.body;
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "No token provided!", auth: false });
    let resultCheck = checkToken(token);
    if (resultCheck.id) {
      await User.updateOne(
        { _id: resultCheck.id },
        { $addToSet: { reviews: { idMovie, review } } },
        (err) => {
          if (err)
            return res.json({
              message: "Error adding the review",
              addReview: false,
              err: err,
            });
          return res.json({
            message: "Added review with success",
            addReview: true,
          });
        }
      );
    } else return res.json(resultCheck);
  },

  index: async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "No token provided!", auth: false });
    let resultCheck = checkToken(token);
    if (resultCheck.id) {
      const userReviews = await User.findOne({ _id: resultCheck.id }, (err) => {
        if (err)
          return res.json({
            message: "Can't find the user!",
            reviews: false,
            err: err,
          });
      });
      return res.json(userReviews.reviews);
    } else return res.json(resultCheck);
  },

  destroy: async (req, res) => {
    const idMovie = req.query.idMovie;
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "No token provided!", auth: false });
    let resultCheck = checkToken(token);
    if (resultCheck.id) {
      await User.updateOne(
        { _id: resultCheck.id },
        { $pull: { reviews: { idMovie } } },
        (err) => {
          if (err)
            return res.json({
              message: "Can't delete the review!",
              deleteReview: false,
              err: err,
            });
          return res.json({
            message: "Review deleted!",
            deleteReview: true,
          });
        }
      );
    } else return res.json(resultCheck);
  },
};

export default reviewController;
