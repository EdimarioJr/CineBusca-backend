import User from "../db/Model/User";
import checkToken from "../utils/checkToken";

const reviewController = {
  create: async (req, res) => {
    const { idMovie, review, score } = req.body;
    let resultCheck = checkToken(req.headers.authorization);
    if (resultCheck.auth) {
      const user = await User.findOne({ _id: resultCheck.id }, (err) => {
        if (err)
          return res.json({
            message: "Cannot find user",
            err: err,
            review: false,
          });
      });

      if (user.review) {
        let reviewExists = false;
        user.reviews.forEach((current) => {
          if (current.idMovie === idMovie) reviewExists = true;
        });
        if (reviewExists) {
          await User.updateOne(
            { _id: resultCheck.id },
            { $pull: { reviews: { idMovie } } },
            (err) => {
              if (err)
                return res.json({
                  message: "Can't delete the old review!",
                  review: false,
                  err: err,
                });
            }
          );
        }
      }
      await User.updateOne(
        { _id: resultCheck.id },
        { $addToSet: { reviews: { idMovie, review, score } } },
        (err) => {
          if (err)
            return res.json({
              message: "Can't add the new review!",
              review: false,
              err: err,
            });
          else
            return res.json({
              message: "Review added with success!!",
              review: true,
              text: review,
            });
        }
      );
    } else return res.json({ ...resultCheck, review: false });
  },

  index: async (req, res) => {
    let resultCheck = checkToken(req.headers.authorization);
    if (resultCheck.auth) {
      const user = await User.findOne({ _id: resultCheck.id }, (err) => {
        if (err)
          return res.json({
            message: "Can't find the user!",
            reviews: false,
            err: err,
          });
      });
      return res.json({
        reviews: user.reviews,
        message: "User reviews found!",
      });
    } else return res.json({ ...resultCheck, reviews: false });
  },

  destroy: async (req, res) => {
    const idMovie = req.query.idMovie;
    let resultCheck = checkToken(req.headers.authorization);
    if (resultCheck.auth) {
      await User.updateOne(
        { _id: resultCheck.id },
        { $pull: { reviews: { idMovie } } },
        (err) => {
          if (err)
            return res.json({
              message: "Can't delete the review!",
              review: false,
              err: err,
            });
          return res.json({
            message: "Review deleted!",
            review: true,
          });
        }
      );
    } else return res.json({ ...resultCheck, review: false });
  },
};

export default reviewController;
