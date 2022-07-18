/*

URL: /users/getAll
METHOD: get
INPUTS:
FUNCTIONS: get users
OUTPUT: user object

*/

const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getUsers = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const userId = state.logged_in_user_id;
    const text =
      "concat(contacts.lastname, ', ', contacts.firstname, ', ', users.email)";
    state.knex = knexInterface.connect(state.knex);
    var query = state.knex
      .select(
        "users.email",
        "users.is_confirmed",
        "users.is_active",
        "contacts.id",
        "contacts.user_id",
        "contacts.firstname",
        "contacts.lastname",
        "contacts.title",
        "contacts.address1",
        "contacts.address2",
        "contacts.city",
        "contacts.state",
        "contacts.zip",
        "contacts.phone"
      )
      .from("users")
      .leftJoin("contacts", "contacts.user_id", "users.id")
      .where({ "contacts.owner_id": userId, "users.is_deleted": 0 });
    if (path.search) {
      query.andWhere(state.knex.raw(text), "like", `%${path.search}%`);
    }
    query
      .then((values) => {
        state.users = values;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getUsers

/* ****
PROMISES END
*** */

/* ****
SHARED FUNCTIONS START
*** */

/* ****
SHARED FUNCTIONS END
**** */

/* ****
MODULE HEADER START
**** */

module.exports = (initialState) => {
  return new Promise((resolve, reject) => {
    /* ****
    MODULE HEADER END
    **** */

    getUsers(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.users;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
