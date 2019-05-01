exports.up = function(knex, Promise) {
    return knex.schema.createTable('taskHistory', table => {
        table.increments('id');
        table.integer('userID').notNullable();
        table.integer('groupID')
            .references('id')
            .inTable('groups')
            .onDelete("CASCADE")
            .notNullable();
        table.integer('taskID').notNullable();
        table.date('completedOn');
      
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

  
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('taskHistory');
  };