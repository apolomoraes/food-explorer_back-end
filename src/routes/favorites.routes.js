const { Router } = require("express");
const favoritesRoutes = Router();

const FavoritesController = require("../controllers/FavoritesController");
const favoritesController = new FavoritesController();

favoritesRoutes.post("/:user_id/:dish_id", favoritesController.create);
favoritesRoutes.delete("/:id", favoritesController.delete);
favoritesRoutes.get("/:user_id", favoritesController.index);

module.exports = favoritesRoutes;