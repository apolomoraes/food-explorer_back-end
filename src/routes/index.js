const { Router } = require("express");
const routes = Router();

const usersRoutes = require("./users.routes");
const dishesRoutes = require("./dishes.routes");

routes.use("/users", usersRoutes);
routes.use("/dishes", dishesRoutes);

module.exports = routes;