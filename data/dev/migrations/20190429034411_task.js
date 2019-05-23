exports.up = function(knex, Promise) {
    return knex.schema.createTable('task', table => {
        table.increments('id');
        table.string('taskName', 128).notNullable();
        table.text('taskDescription');
        table.boolean('completed').defaultTo(false);
        table.integer('completedBy');
        table.date('completedOn');
        table.integer('groupID').references('id').inTable('groups').onDelete("CASCADE").notNullable();
        table.string('assigneeName');
        table.string('createdBy');
        table.string('recurringTime').defaultTo("");
        table.integer('numberOfComments').defaultTo(0);
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('task');
  };