const { Router } = require("express");
const purchasesRoutes = Router();

const PurchasesController = require("../controllers/PurchasesController");
const purchasesController = new PurchasesController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

purchasesRoutes.use(ensureAuthenticated);
purchasesRoutes.post("/", purchasesController.create);
purchasesRoutes.patch("/:id", purchasesController.update);
purchasesRoutes.get("/", purchasesController.index);

module.exports = purchasesRoutes;