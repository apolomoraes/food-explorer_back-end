const { Router } = require("express");
const routes = Router();

const usersRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const dishesRoutes = require("./dishes.routes");
const favoritesRoutes = require("./favorites.routes");
const requestsRoutes = require("./requests.routes");
const purchasesRoutes = require("./purchases.routes");

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/dishes", dishesRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/requests", requestsRoutes);
routes.use("/purchases", purchasesRoutes);

module.exports = routes;