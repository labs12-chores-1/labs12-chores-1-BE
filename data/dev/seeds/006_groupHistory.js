
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groupHistory').del()
    .then(function () {
      // Inserts seed entries
      return knex('groupHistory').insert([
        {id: 1, userID: 1, groupID:1, itemID:1, total:10.00, purchasedOn:"Tue Mar 24 2015 19:00:00 GMT-0500"}
      ]);
    });

};
