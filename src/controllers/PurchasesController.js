const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class PurchasesController {
  async create(req, res) {
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
      created_at: new Date()
    });
    await knex('requests').where({ user_id }).delete();

    return res.status(201).json();
  }

  async update(req, res) {
    const { status } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    const user = await knex('users').where({ id: user_id }).first();
    const userAdmin = user.admin === 1;

    if (!userAdmin) {
      throw new AppError("Usuário não autorizado")
    } else {
      await knex('purchases')
        .update({
          status,
          updated_at: knex.fn.now()
        })
        .where({ id });
    }

    return res.status(200).json();
  }

  async index(req, res) {
    const user_id = req.user.id;

    const user = await knex('users').where({ id: user_id }).first();
    const userAdmin = user.admin === 1;

    let purchases;

    if (userAdmin) purchases = await knex('purchases');
    else purchases = await knex('purchases').where({ user_id });

    return res.status(200).json(purchases);
  }
}

module.exports = PurchasesController;