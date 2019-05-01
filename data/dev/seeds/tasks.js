
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('task').del()
    .then(function () {
      // Inserts seed entries
      return knex('task').insert([
        {id: 1, taskName: 'Clean bathroom', groupID:1},
        {id: 2, taskName: 'Clearn kitchen', groupID:1}
      ]);
    });
};
