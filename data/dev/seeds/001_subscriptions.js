
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('subscriptions').del()
    // .then(function () {
      // Inserts seed entries
      return knex('subscriptions').insert([
        {name: 'Free', amount: 0.00},
        {name: 'Premium', amount: 9}
      ]);
    // });
};
