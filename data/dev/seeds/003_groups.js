
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      // Inserts seed entries
      return knex('groups').insert([
        {id: 1, userID: 1, name: "Tsai Huang", token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5UZEROemN5UTBWRE16WkRSVFJDTVRVME1rUkZOMEkzTmtZMU9UTTNSVUl6TWtVMFFrRkJOUSJ9.eyJnaXZlbl9uYW1lIjoiVHNhaSIsImZhbWlseV9uYW1lIjoiSHVhbmciLCJuaWNrbmFtZSI6InRzYWlodWFuZ3NkIiwibmFtZSI6IlRzYWkgSHVhbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1iQ3UzZ2ZtR2xVay9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JjWHQ4SXJWVVhGMEZuWEcwTXZ2ZG1ONmlBV3hnL21vL3Bob3RvLmpwZyIsImxvY2FsZSI6ImVuIiwidXBkYXRlZF9hdCI6IjIwMTktMDUtMDFUMTc6NDc6MzkuMTgxWiIsImVtYWlsIjoidHNhaWh1YW5nc2RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LXpiY2t4MmpnLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMjkzMjA5Nzg5ODcwMzcxMTE5NiIsImF1ZCI6IkM2WWE2cGRoUUI2OEg1TUJjT1ZNdVd1dVU1TWV0d0h1IiwiaWF0IjoxNTU2NzMyODU5LCJleHAiOjE1NTY3Njg4NTksImF0X2hhc2giOiI0aWpxMDQ1eGhNdjdSVVE0Rzc0Y1JRIiwibm9uY2UiOiI3M0gxUHQzTFM4TG5KQ0F0RmZtVUFyUHZDMXhjWkhGdCJ9.BHuFNNLKyu3T6DTBgY_cSJ-DUMwj5BSRdL-1RFHvBbydlpuRc9NeiFUMIYl2ML4o733WnwMJhuMAMsYIflAvHgyQJKE7P-46Pf1_PiuJZBZTITARL45DCcqbQIVXGJla9JX7czbZu2QqVOhpjAfyBnG4JoKZGQHNuLUDhL0SvQzl4W2YVqANJyAq5YY4aXOCvthe1SRpdQs4VPz8rjP9NzUo0ywOLxPbq6ok0tynsl1awmIzoCxOSZHhd2xEJ50JeucSBa0WIErdggKNhX-jDadHhX9xxRfowHI4u4HPqHRwZhDaicng58ti_8jJp4_Jg6PCvrRaBBkPtM4--tzyrQ"}
        // {id: 2, colName: 'rowValue2'},
        // {id: 3, colName: 'rowValue3'}
      ]);
    });

};
