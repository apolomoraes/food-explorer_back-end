const { Router } = require("express");
const requestsRoutes = Router();

const RequestsController = require("../controllers/RequestController");
const requestsController = new RequestsController();

requestsRoutes.post("/:user_id", requestsController.create);
requestsRoutes.get("/:user_id", requestsController.index);
requestsRoutes.delete("/:id", requestsController.delete);

module.exports = requestsRoutes;