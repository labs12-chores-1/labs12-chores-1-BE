
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groupMembers').del()
    .then(function () {
      // Inserts seed entries
      return knex('groupMembers').insert([
        {id: 1, userID: 1, groupID: 1 },
        {id: 2, userID: 2, groupID: 1 }
      ]);
    });
};
