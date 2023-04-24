const AppError = require("../utils/AppError");
const knex = require("../database/knex")

class DishesController {
  async create(req, res) {
    const { name, category, price, description, image } = req.body;

    if (!name || !category || !price || !description || !image) {
      throw new AppError("Preencha todos os campos");
    }

    await knex("dishes").insert({
      name,
      category,
      price,
      description,
      image,
    })

    return res.status(201).json();
  }
}
