exports.up = knex => knex.schema.createTable("purchases", table => {
  table.increments("id");

  table
    .integer("user_id")
    .references("id")
    .inTable("users")
    .onDelete("CASCADE")
    .notNullable();

  table.text("status").defaultTo("pending");
  table.text("details").notNullable();

  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable("purchases");