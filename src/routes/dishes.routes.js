const { Router } = require("express");
const dishesRoutes = Router();

const DishesController = require("../controllers/DishesController");
const dishesController = new DishesController();

dishesRoutes.post("/:user_id", dishesController.create);
dishesRoutes.put("/:id", dishesController.update);

module.exports = dishesRoutes;