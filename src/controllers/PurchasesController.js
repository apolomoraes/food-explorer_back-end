const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class PurchasesController {
  async create(req, res) {
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

    const ordersTotalAmount = requests.map(request => {
      return { ...request, amount: parseFloat(request.price) * parseFloat(request.quantity) };
    });

    const detailing = ordersTotalAmount.reduce(
      (accumulator, item) => accumulator + `${item.quantity} x ${item.name}, `,
      ''
    );

    await knex('purchases').insert({
      user_id,
      details: detailing.slice(0, -2),
      created_at: new Date(),
    });
    await knex('requests').where({ user_id }).delete();

    return res.status(201).json();
  }
}

module.exports = PurchasesController;