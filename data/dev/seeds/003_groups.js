
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      // Inserts seed entries
      return knex('groups').insert([
        {id: 1, userID: 1, name: "Default Group" }
        // {id: 3, colName: 'rowValue3'}
      ]);
    });

};
