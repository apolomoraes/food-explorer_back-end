const { Router } = require("express");
const purchasesRoutes = Router();

const PurchasesController = require("../controllers/PurchasesController");
const purchasesController = new PurchasesController();

purchasesRoutes.post("/:user_id", purchasesController.create);
purchasesRoutes.patch("/:id", purchasesController.update);
purchasesRoutes.get("/:user_id", purchasesController.index);

module.exports = purchasesRoutes;