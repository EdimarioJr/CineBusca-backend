import express from "express";
import userController from "./controllers/userController";

const routes = express.Router();

routes.post("/signin", userController.auth);

routes.post("/signup", userController.create);

routes.get("/watchlist", userController.index);

routes.post("/addwatchlist", userController.addWatchlist);

export default routes;
