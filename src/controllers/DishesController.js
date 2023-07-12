const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
  async create(req, res) {
    const user_id = req.user.id;
    const { name, category, price, description, ingredients } = req.body;
    let image = null;
    let filename = null;

    const diskStorage = new DiskStorage()

    if (!name || !category || !price || !description || !ingredients) {
      throw new AppError("Preencha todos os campos");
    }

    const user = await knex('users').where({ id: user_id }).first();
    const userAdmin = user.admin === 1;

    if (!userAdmin) {
      throw new AppError("Usuário não autorizado");
    } else {

      if (req.file) {
        image = req.file.filename
        filename = await diskStorage.saveFile(image)
      }


      const [dish_id] = await knex("dishes").insert({
        name,
        category,
        price,
        description,
        image: image ? filename : null,
        user_id
      });

      const ingredientsInsert = JSON.parse(ingredients).map(name => {
        return {
          dish_id,
          name
        }
      });

      await knex("ingredients").insert(ingredientsInsert);
    }

    return res.status(201).json();
  }

  async update(req, res) {
    const user_id = req.user.id;
    const { name, category, price, description, ingredients } = req.body;
    const { id } = req.params;
    let image = null;
    let filename = null;

    const diskStorage = new DiskStorage()

    if (!name || !category || !price || !description || !ingredients) {
      throw new AppError("Preencha todos os campos");
    }

    const user = await knex('users').where({ id: user_id }).first();
    const userAdmin = user.admin === 1;

    if (!userAdmin) {
      throw new AppError("Usuário não autorizado");
    } else {
      const dish = await knex("dishes").where({ id }).first();

      filename = dish.image

      if (req.file) {
        if (dish.image) {
          await diskStorage.deleteFile(dish.image)
        }

        image = req.file.filename
        filename = await diskStorage.saveFile(image)
      }

      await knex('dishes').where({ id }).update({
        name,
        category,
        price,
        description,
        image: filename,
        updated_at: knex.fn.now()
      });

      const newIngredientsInsert = JSON.parse(ingredients).map(name => {
        return {
          dish_id: id,
          name,
        };
      });

      await knex("ingredients").where({ dish_id: id }).delete();

      await knex('ingredients').insert(newIngredientsInsert);
    }

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
    const user_id = req.user.id;

    const user = await knex('users').where({ id: user_id }).first();
    const userAdmin = user.admin === 1;

    if (!userAdmin) {
      throw new AppError("Usuário não autorizado");
    } else {
      await knex("dishes").where({ id }).delete();
    }

    return res.json();
  }
}

module.exports = DishesController;