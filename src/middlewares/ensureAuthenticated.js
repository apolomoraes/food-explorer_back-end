const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError("JWT Token inválido ou não encontrado", 401);

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(user_id)
    };

    return next()
  } catch {
    throw new AppError("JWT Token inválido", 401);
  };
}

modules.exports = ensureAuthenticated;