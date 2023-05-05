const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await knex("users").where({ email }).first();

    if (!user) throw new AppError("Email e/ou senha incorreta", 401);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppError("Email e/ou senha incorreta", 401);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return res.status(200).json({ user, token });
  }
}

module.exports = SessionsController;