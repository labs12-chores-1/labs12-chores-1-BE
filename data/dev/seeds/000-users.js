
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'Ilqar Ilyasov', email: 'imilqar@gmail.com'},
        {id: 2, name: 'Tsai Huang', email: 'tsaihuangsd@gmail.com'},
      ]);
    });
};
