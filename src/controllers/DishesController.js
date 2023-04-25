const AppError = require("../utils/AppError");
const knex = require("../database/knex")

class DishesController {
  async create(req, res) {
    const { name, category, price, description, ingredients, image } = req.body;
    const { user_id } = req.params;

    if (!name || !category || !price || !description || !ingredients || !image) {
      throw new AppError("Preencha todos os campos");
    }

    const [dish_id] = await knex("dishes").insert({
      name,
      category,
      price,
      description,
      image,
      user_id
    });

    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id,
        name
      }
    });

    await knex("ingredients").insert(ingredientsInsert);

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, category, price, description, ingredients, image } = req.body;
    const { id } = req.params;

    if (!name || !category || !price || !description || !ingredients || !image) {
      throw new AppError("Preencha todos os campos");
    }

    // Atualiza os dados principais do prato
    await knex('dishes').where({ id }).update({
      name,
      category,
      price,
      description,
      image,
      updated_at: knex.fn.now()
    });

    // Insere os novos ingredientes
    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id: id,
        name,
      };
    });

    await knex('ingredients').insert(ingredientsInsert);

    return res.status(200).json();
  }
}

module.exports = DishesController;