exports.up = function(knex, Promise) {
    return knex.schema.createTable('comments', (table) => {
        // initialize comments table db rows

        //auto-increment primary key for table i.e. comment ID
        table.increments('id');
        table.string('commentString', 255).notNullable();
        table.integer('taskID').references('id').inTable('task').onDelete("CASCADE").notNullable();
        table.integer('groupID').references('id').inTable('groups').onDelete("CASCADE").notNullable();
        table.integer('commentedBy').references('id').inTable('users').notNullable();

        // timestamps the moment of user creation (i.e. registration date)
        table.timestamp('commentedOn').defaultTo(knex.fn.now());


    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('comments');
};