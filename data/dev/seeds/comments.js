
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        {id: 1, commentString: 'Good morning', "taskID":1, "groupID":1, "commentedBy":1},
        {id: 2, commentString: 'Good afternoon', "taskID":1, "groupID":1, "commentedBy":1},
        {id: 3, commentString: 'Good evening', "taskID":1, "groupID":1, "commentedBy":1},
      ]);
    });
};
