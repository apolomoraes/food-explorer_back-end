const { Router } = require("express");
const favoritesRoutes = Router();

const FavoritesController = require("../controllers/FavoritesController");
const favoritesController = new FavoritesController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

favoritesRoutes.use(ensureAuthenticated);
favoritesRoutes.post("/", favoritesController.create);
favoritesRoutes.delete("/:id", favoritesController.delete);
favoritesRoutes.get("/", favoritesController.index);

module.exports = favoritesRoutes;