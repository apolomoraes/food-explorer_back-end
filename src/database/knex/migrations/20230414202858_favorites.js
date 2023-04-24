exports.up = knex => knex.schema.createTable("favorites", table => {
  table.increments("id");
  table.unique(['dish_id', 'user_id']);

  table
    .integer("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable();

  table
    .integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE").notNullable();
})


exports.down = knex => knex.schema.dropTable("favorites");
