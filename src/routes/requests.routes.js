const { Router } = require("express");
const requestsRoutes = Router();

const RequestsController = require("../controllers/RequestController");
const requestsController = new RequestsController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

requestsRoutes.use(ensureAuthenticated);
requestsRoutes.post("/", requestsController.create);
requestsRoutes.get("/", requestsController.index);
requestsRoutes.get("/show", requestsController.show);
requestsRoutes.delete("/:id", requestsController.delete);

module.exports = requestsRoutes;