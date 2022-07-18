/*

URL: /projects/getOwners
METHOD: get
INPUTS: user_id
OUTPUT: owner ids and names

*/
const knexInterface = require("../../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getOwners = (state) => {
  return new Promise((resolve, reject) => {
    const userId = state.logged_in_user_id;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select("parent_user_id as id", "email as text")
      .from("users_users")
      .innerJoin("users", "users_users.parent_user_id", "users.id")
      .where({
        "users.id": userId,
        "users.is_deleted": 0,
        "users_users.is_deleted": 0,
      })
      .orderBy("email")
      .then((values) => {
        values.unshift({ id: state.logged_in_user_id, text: "Me" });

        state.response = values;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getOwners

/* ****
PROMISES END
*** */

/* ****
MODULE HEADER START
**** */

module.exports = (initialState) => {
  return new Promise((resolve, reject) => {
    /* ****
    MODULE HEADER END
    **** */

    getOwners(initialState)
      /* ****
      MODULE FOOTER START
      **** */
      .then((state) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
