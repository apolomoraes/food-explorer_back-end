const { Router } = require("express");
const purchasesRoutes = Router();

const PurchasesController = require("../controllers/PurchasesController");
const purchasesController = new PurchasesController();

purchasesRoutes.post("/:user_id", purchasesController.create);
// purchasesRoutes.get("/:user_id", purchasesController.index);
// purchasesRoutes.delete("/:id", purchasesController.delete);

module.exports = purchasesRoutes;