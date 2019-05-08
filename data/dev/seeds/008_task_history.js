
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('taskHistory').del()
    .then(function () {
      // Inserts seed entries
      return knex('taskHistory').insert([
        {id: 1, userID:1, taskID:1, groupID:1}
      ]);
    });
};
