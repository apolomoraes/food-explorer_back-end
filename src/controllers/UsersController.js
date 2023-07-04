const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex")

class UsersController {
  async create(req, res) {
    const { name, email, password, admin } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Preencha todos os campos");
    }

    if (password.length < 6) {
      throw new AppError("A senha deve ter no mínimo 6 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Endereço de e-mail inválido");
    }

    const passwordRegex = /^\S+$/;
    if (!passwordRegex.test(password)) {
      throw new AppError("A senha não pode conter espaços em branco");
    }

    const checkUserExist = await knex("users").where({ email }).first();

    if (checkUserExist) {
      throw new AppError("Este e-mail já está em uso");
    }

    const encryptPassword = await hash(password, 8);

    await knex('users').insert({
      name,
      email,
      password: encryptPassword,
      admin: admin ? 1 : 0,
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;
    console.log(user_id);

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Endereço de e-mail inválido");
    }

    let userWithUpdatedEmail;

    if (email) {
      userWithUpdatedEmail = await knex("users").where({ email }).first();
    } else {
      userWithUpdatedEmail = await knex("users").where({ email: user.email }).first();
    }

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga incorreta");
      }

      user.password = await hash(password, 12);
    }

    await knex("users").update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now()
    }).where({ id: user.id });

    return res.status(200).json();
  }
}

module.exports = UsersController;