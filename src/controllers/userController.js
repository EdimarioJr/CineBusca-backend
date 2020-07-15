import User from "../db/Model/User";
import bcrypt from "bcrypt";
import checkUsername from "../utils/checkUsername";
import jwt from "jsonwebtoken";
import checkToken from "../utils/checkToken";

const userController = {
  create: async (req, res) => {
    let { name, password, watchlist } = req.body;
    // checkUsername will return the user, if the user exists
    if (await checkUsername(name)) {
      return res.json({
        message: "The username already exists!",
        signup: false,
      });
    } else {
      // crypting the password, with salt = 10,  10 terms are add before the password
      bcrypt.hash(password, 10).then((hash) => {
        const encryptedPassword = hash;
        watchlist = watchlist ? watchlist : [];
        const newUser = new User({
          name,
          password: encryptedPassword,
          watchlist,
        });
        newUser
          .save()
          .then((response) =>
            res.json({
              message: "User created with success",
              user: response,
              signup: true,
            })
          )
          .catch((err) => {
            if (err)
              return res.json({
                message: "Error creating the User",
                error: err,
                signup: false,
              });
          });
      });
    }
  },

  auth: async (req, res) => {
    const { name, password } = req.body;
    const user = await checkUsername(name);
    if (user) {
      // if user exists, we will compare the password in the DB with the password from the front end.
      // for that the method compare of bcrypt is used
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const id = user._id;
        // if the password is correct, the jwt TOKEN will be created and will be returned to the user
        // the id of the user will be the payload of the jwt
        const token = jwt.sign({ id }, process.env.SECRET_JWT, {
          expiresIn: 300,
        });
        return res.json({ message: "Acesso garantido!", token, signin: true });
      } else return res.json({ message: "Wrong password!", signin: false });
    } else {
      return res.json({ message: "Username don't exist!", signin: false });
    }
  },

  index: async (req, res) => {
    // when the user tries to access the watchlist, the jwt will be required
    // the token will be sended from the front end in the headers of the requisition
    let resultCheck = "";
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "No token provided!", auth: false });
    // verifying the authenticity of the token
    resultCheck = checkToken(token);
    // if the token is cool, we will use the id in the payload of the token to make a request to the DB
    if (resultCheck.id) {
      let userW = await User.findOne({ _id: resultCheck.id }, (err) => {
        if (err) return res.json({ message: "User not found!", auth: true });
      });
      userW = userW.watchlist;
      return res.json({ message: "User found!", watchlist: userW, auth: true });
    } else return res.json(resultCheck);
  },

  addWatchlist: async (req, res) => {
    const { idMovie } = req.body;
    const token = req.headers.authorization;
    if (!token) return res.json({ message: "No token provided!", auth: false });
    let resultCheck = checkToken(token);
    if (resultCheck.id) {
      await User.updateOne(
        { _id: resultCheck.id },
        // addToSet makes a push operation in a property of the model that is a array
        { $addToSet: { watchlist: [idMovie] } },
        (err) => {
          if (err)
            return res.json({
              message: "Error adding in the watchlist",
              add: false,
              err: err,
            });
          return res.json({
            message: "Added with success in the watchlist",
            add: true,
          });
        }
      );
    } else return res.json(resultCheck);
  },

  logout: async (req, res) => {
    return res.json({ message: "User logout!", token: null, auth: false });
  },
};

export default userController;
