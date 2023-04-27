const { Router } = require("express");
const dishesRoutes = Router();

const DishesController = require("../controllers/DishesController");
const dishesController = new DishesController();

dishesRoutes.post("/:user_id", dishesController.create);
dishesRoutes.put("/:id", dishesController.update);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);

module.exports = dishesRoutes;