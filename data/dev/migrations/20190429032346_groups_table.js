
exports.up = function(knex, Promise) {
    return knex.schema.createTable('groups', function(tbl) {
        tbl.increments('id');
    
        tbl.integer('userID').references('id').inTable('users').onDelete("CASCADE").notNullable();
        tbl.string('name').notNullable();
        tbl.timestamp('createdAt').defaultTo(knex.fn.now());
        tbl.timestamp('updatedAt').defaultTo(knex.fn.now());
        
      })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('groups');
};
