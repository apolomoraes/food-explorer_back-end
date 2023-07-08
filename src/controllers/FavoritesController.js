const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class FavoritesController {
  async create(req, res) {
    const user_id = req.user.id;
    const { dish_id } = req.body;

    const user = await knex("users").where({ id: user_id }).first();
    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (!user || !dish) {
      throw new AppError("Usuário ou prato não encontrado");
    }

    const existFavoriteDish = await knex("favorites").where({ user_id, dish_id }).first();

    if (existFavoriteDish) {
      throw new AppError("Prato já favoritado");
    }

    const [id] = await knex("favorites").insert(
      {
        user_id,
        dish_id
      }
    )

    return res.status(201).json({ id });
  }

  async index(req, res) {
    const user_id = req.user.id;

    const favorites = await knex("favorites")
      .select(["dishes.id as dish_id", "dishes.name", "dishes.image", "favorites.id"])
      .innerJoin("dishes", "dishes.id", "=", "favorites.dish_id")
      .where("favorites.user_id", user_id);

    return res.json(favorites)
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("favorites").where({ id }).delete();

    return res.json();
  }
}

module.exports = FavoritesController;