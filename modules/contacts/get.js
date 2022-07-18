/*

URL: /contacts/get
METHOD: get
INPUTS: owner_id
FUNCTIONS: get contacts
OUTPUT: array of contact objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getContacts = (state) => {
  return new Promise((resolve, reject) => {
    const userId = state.logged_in_user_id;
    const event = state.event;
    const path = event.params;
    const text =
      "concat(contacts.lastname, ', ', contacts.firstname, ', ', contacts.email)";
    var where = {
      "contacts.is_deleted": 0,
      "contacts.owner_id": userId,
    };

    state.knex = knexInterface.connect(state.knex);
    var query = state.knex
      .select(
        "contacts.id",
        "contacts.company_id",
        "contacts.user_id",
        "contacts.firstname",
        "contacts.lastname",
        "contacts.title",
        "contacts.address1",
        "contacts.address2",
        "contacts.city",
        "contacts.state",
        "contacts.zip",
        "contacts.email",
        "contacts.phone",
        "contacts.owner_id",
        "companies.name as company_name"
      )
      .from("contacts")
      .leftJoin("companies", "contacts.company_id", "companies.id")
      .where(where);
    if (path.search) {
      query.andWhere(state.knex.raw(text), "like", `%${path.search}%`);
    }
    query
      .then((values) => {
        state.contacts = values;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getProject

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

    getContacts(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.contacts;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
