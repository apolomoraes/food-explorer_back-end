const AppError = require("../utils/AppError");
const knex = require("../database/knex");

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

    const newIngredientsInsert = ingredients.map(name => {
      return {
        dish_id: id,
        name,
      };
    });

    await knex("ingredients").where({ dish_id: id }).delete();

    await knex('ingredients').insert(newIngredientsInsert);

    return res.status(200).json();
  }

  async show(req, res) {
    const { id } = req.params;

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError('Prato não encontrado');
    }

    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

    return res.json({
      ...dish,
      ingredients
    });
  }

  async index(req, res) {
    const { search } = req.query;


    const dishes = await knex.select("dishes.*")
      .from("dishes")
      .innerJoin("ingredients", "dishes.id", "=", "ingredients.dish_id")
      .whereLike("dishes.name", `%${search}%`)
      .orWhereLike("ingredients.name", `%${search}%`)
      .groupBy('dishes.name');

    return res.json(dishes);
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("dishes").where({ id }).delete();

    return res.json();
  }
}

module.exports = DishesController;