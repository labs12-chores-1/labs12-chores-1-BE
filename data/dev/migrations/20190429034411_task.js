exports.up = function(knex, Promise) {
    return knex.schema.createTable('task', table => {
        table.increments('id');
        table.string('taskName', 128).notNullable();
        table.text('description');
        table.boolean('completed');
        table.integer('completedBy').references('id').inTable('users');
        table.date('completedOn');
        table.integer('groupID').references('id').inTable('groups').onDelete("CASCADE").notNullable();
        
  
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('task');
  };