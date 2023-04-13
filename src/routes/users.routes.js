const { Router } = require("express");

const usersRoutes = Router();

usersRoutes.post("/", (req, res) => {
  const { name, email, password, admin } = req.body;

  return res.json({ name, email, password })
});

module.exports = usersRoutes;