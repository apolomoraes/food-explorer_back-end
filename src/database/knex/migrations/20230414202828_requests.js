exports.up = knex => knex.schema.createTable("requests", table => {
  table.increments("id");

  table
    .integer("dish_id").references("id").inTable("dishes").onDelete("CASCADE").notNullable();

  table
    .integer("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable();

  table.integer("quantity").notNullable();
})


exports.down = knex => knex.schema.dropTable("requests");
