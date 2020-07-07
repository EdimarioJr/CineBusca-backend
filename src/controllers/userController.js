import User from "../db/Model/User";
import bcrypt from "bcrypt";
import checkUsername from "../utils/checkUsername";

const userController = {
  create: async (req, res) => {
    let { name, password } = req.body;
    name = name.trim();
    if (await checkUsername(name)) {
      return res.json({ message: "The username already exists!" });
    } else {
      // crypting the password, with salt = 10,  10 terms are add before the password
      bcrypt.hash(password, 10).then((hash) => {
        const encryptedPassword = hash;
        const newUser = new User({
          name,
          password: encryptedPassword,
        });
        newUser
          .save()
          .then((response) =>
            res.json({ message: "User created with success", user: response })
          )
          .catch((err) => {
            if (err)
              return res.json({
                message: "Error creating the User",
                error: err,
              });
          });
      });
    }
  },

  auth: async (req, res) => {
    let { name, password } = req.body;
    name = name.trim();
    const user = await checkUsername();
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) return res.json({ message: "Acesso garantido!" });
      else return res.json({ message: "Senha incorreta!" });
    } else {
      return res.json({ message: "Username don't exist!" });
    }
  },
};

export default userController;
