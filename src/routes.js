import express from "express";
import userController from "./controllers/userController";

const routes = express.Router();

routes.get("/", (req, res) => {
  return res.send("GET HOMEPAGE");
});

routes.post("/signin", userController.auth);

routes.post("/signup", userController.create);

routes.get('/watchlist',userController.index);

export default routes;
