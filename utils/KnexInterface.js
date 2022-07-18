const knexLib = require("knex");
const knexFile = require("../config/knexfile");

module.exports = {
  connect(knex) {
    if (!knex) {
      knex = knexLib(knexFile);

      if (process.env.ENV !== "prod") {
        knex.on("query", (queryData) => {
          console.log("QUERY HERE:");
          console.log(queryData);
        });
      }
    }

    return knex;
  },

  destroy(knex) {
    if (knex) {
      if (knex.client) {
        knex.destroy();
      }

      knex = null;
    }

    return null;
  },
};
