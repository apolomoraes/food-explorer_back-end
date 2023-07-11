const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class RequestController {
  async create(req, res) {
    const user_id = req.user.id;
    const { quantity, dish_id } = req.body;

    const user = await knex('users').where({ id: user_id }).first();
    const dish = await knex('dishes').where({ id: dish_id }).first();

    if (!user || !dish) throw new AppError("Usuário ou prato não encontrado");

    const existRequest = await knex("requests").where({ user_id, dish_id }).first();

    if (existRequest) {
      await knex("requests")
        .update({
          ...existRequest,
          quantity
        })
        .where({ user_id, dish_id })
    } else {
      await knex("requests")
        .insert({ user_id, dish_id, quantity });
    };

    return res.status(201).json();
  }

  async index(req, res) {
    const user_id = req.user.id;

    const requests = await knex("requests")
      .select(
        "requests.dish_id",
        "requests.quantity",
        "dishes.name",
        "dishes.description",
        "dishes.price",
        "dishes.image"
      )
      .from("requests")
      .innerJoin("dishes", "dishes.id", "=", "requests.dish_id")
      .where("requests.user_id", user_id);

    const totalOrderValue = requests.map((request) => {
      return { ...request, amount: parseFloat(request.price) * parseFloat(request.quantity) };
    });

    return res.json(totalOrderValue);
  }

  async show(req, res) {
    const user_id = req.user.id;

    const requests = await knex("requests")
      .select(
        "requests.dish_id",
        "requests.quantity"
      )
      .from("requests")
      .where("requests.user_id", user_id);


    let totalQuantity = 0;

    requests.forEach((request) => {
      totalQuantity += request.quantity;
    });


    return res.json({ totalQuantity });
  }
  async delete(req, res) {
    const { id } = req.params;

    await knex('requests').where({ id }).delete();

    return res.json();
  }
}

module.exports = RequestController;