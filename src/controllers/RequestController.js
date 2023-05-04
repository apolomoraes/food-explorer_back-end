const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class RequestController {
  async create(req, res) {
    const { user_id } = req.params;
    const { quantity, dish_id } = req.body;

    const user = await knex('users').where({ id: user_id }).first();
    const dish = await knex('dishes').where({ id: dish_id }).first();

    if (!user || !dish) throw new AppError("Usuário ou prato não encontrado");

    // function zeroLeft(num) {
    //   return num >= 10 ? num : `0${num}`
    // }

    // function updateDate(data) {
    //   const day = zeroLeft(data.getDate());
    //   const month = zeroLeft(data.getMonth() + 1);
    //   const year = zeroLeft(data.getFullYear());
    //   const hours = zeroLeft(data.getHours());
    //   const minutes = zeroLeft(data.getMinutes());

    //   return `${day}/${month}/${year} às ${hours}:${minutes}`
    // }

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
    const { user_id } = req.params;

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
  async delete(req, res) {
    const { id } = req.params;

    await knex('requests').where({ id }).delete();

    return res.json();
  }
}

module.exports = RequestController;