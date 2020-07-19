import express from "express";
import userController from "./controllers/userController";
import watchlistController from "./controllers/watchlistController";
import reviewController from "./controllers/reviewController";

const routes = express.Router();

routes.post("/signin", userController.auth);

routes.post("/signup", userController.create);

routes.get("/watchlist", watchlistController.index);

routes.post("/watchlist", watchlistController.store);

routes.delete("/watchlist", watchlistController.destroy);

routes.post("/reviews", reviewController.create);

routes.get("/reviews", reviewController.index);

routes.delete("/reviews", reviewController.destroy);

export default routes;
