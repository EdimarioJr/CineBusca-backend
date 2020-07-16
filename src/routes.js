import express from "express";
import userController from "./controllers/userController";
import watchlistController from './controllers/watchlistController'

const routes = express.Router();

routes.post("/signin", userController.auth);

routes.post("/signup", userController.create);

routes.get("/watchlist", watchlistController.index);

routes.post("/watchlist", watchlistController.store);

routes.delete("/watchlist", watchlistController.destroy)

export default routes;
