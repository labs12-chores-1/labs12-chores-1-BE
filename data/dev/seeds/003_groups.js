
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      // Inserts seed entries
      return knex('groups').insert([
<<<<<<< HEAD
        {id: 1, userID: 1, name: "Tsai Huang"}
=======
        {id: 1, userID: 1, name: "John Doe" }
>>>>>>> master
        // {id: 2, colName: 'rowValue2'},
        // {id: 3, colName: 'rowValue3'}
      ]);
    });

};
