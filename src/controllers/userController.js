import User from "../db/Model/User";
import bcrypt from "bcrypt";
import checkUsername from "../utils/checkUsername";
import jwt from "jsonwebtoken";

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
          expiresIn: 3000,
        });
        return res.json({ message: "Acesso garantido!", token, signin: true });
      } else return res.json({ message: "Wrong password!", signin: false });
    } else {
      return res.json({ message: "Username don't exist!", signin: false });
    }
  },

  logout: async (req, res) => {
    return res.json({ message: "User logout!", token: null, auth: false });
  },
};

export default userController;
