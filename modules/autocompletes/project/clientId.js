/*

URL: /autocompletes/project/clientId
METHOD: get
INPUTS: search
OUTPUT: Array

*/
const knexInterface = require("../../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const search = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const searchText = path.search;

    const query = event.query;
    if (query.owner_id == null || query.owner_id == undefined) {
      query.owner_id = state.logged_in_user_id;
    }
    const ownerId = query.owner_id;

    const exact = path.exact;

    let operator = "like";

    let wildcard = "%";

    if (exact) {
      operator = "=";
      wildcard = "";
    }

    const where = { owner_id: ownerId, is_deleted: 0 };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select("id", "name as text")
      .from("companies")
      .where(where)
      .andWhere("name", operator, `${wildcard}${searchText}${wildcard}`)
      .orderBy("name")
      .then((values) => {
        state.response = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // search

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

    search(initialState)
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
