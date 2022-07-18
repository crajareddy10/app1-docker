/*

URL: /companies/get
METHOD: get
INPUTS: owner_id
FUNCTIONS: get companies
OUTPUT: array of company objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getCompanies = (state) => {
  return new Promise((resolve, reject) => {
    const userId = state.logged_in_user_id;
    const event = state.event;
    const path = event.params;

    state.knex = knexInterface.connect(state.knex);
    var query = state.knex
      .select(
        "id",
        "name",
        "is_owner",
        "type_id",
        "org_type_id",
        "address1",
        "address2",
        "city",
        "state",
        "zip",
        "email",
        "phone",
        "owner_id"
      )
      .from("companies")
      .where({ owner_id: userId, is_deleted: 0 });
    if (path.search) {
      query.andWhere("name", "like", `%${path.search}%`);
    }
    query
      .then((values) => {
        state.vendors = values;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getCompany

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

    getCompanies(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.vendors;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
