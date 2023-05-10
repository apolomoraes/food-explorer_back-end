const { Router } = require("express");
const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");
const usersController = new UsersController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = usersRoutes;