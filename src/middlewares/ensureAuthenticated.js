const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError("JWT Token inválido ou não encontrado", 401);

  const [, token] = authHeader.split(" ");
}