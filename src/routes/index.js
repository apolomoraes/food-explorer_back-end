const { Router } = require("express");
const routes = Router();

const usersRoutes = require("./users.routes");
const dishesRoutes = require("./dishes.routes");
const favoritesRoutes = require("./favorites.routes");

routes.use("/users", usersRoutes);
routes.use("/dishes", dishesRoutes);
routes.use("/favorites", favoritesRoutes);

module.exports = routes;