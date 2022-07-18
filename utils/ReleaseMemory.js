const knexInterface = require("./KnexInterface");

module.exports = (initialState) => {
  if (initialState.knex) {
    initialState.knex = knexInterface.destroy(initialState.knex);
  }

  initialState = null;

  return null;
};
