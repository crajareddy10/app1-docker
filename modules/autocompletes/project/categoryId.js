/*

URL: /autocompletes/project/contactId
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

    if (query.project_id == null || query.project_id == undefined) {
      query.project_id = null;
    }

    const ownerId = query.owner_id;

    const projectId = query.project_id;

    const text = "name";

    const code = "code";

    const exact = path.exact;

    let operator = "like";

    let wildcard = "%";

    let where = { is_deleted: 0 };

    if (exact) {
      operator = "=";
      wildcard = "";
    }

    if (query.project_id) {
      where = { is_deleted: 0, project_id: projectId };
    }

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select(
        state.knex.raw(
          `id, ${text} as text, name, code, default_markup_bp, default_insurance_bp, default_hourday_id, default_fringe_pw_bp, default_fringe_2_bp, default_taxable_in_cents, default_non_taxable_in_cents`
        )
      )
      .from("categories")
      .where(where)
      .where(function (q) {
        q.andWhere(
          state.knex.raw(text),
          operator,
          `${wildcard}${searchText}${wildcard}`
        ).orWhere(
          state.knex.raw(code),
          operator,
          `${wildcard}${searchText}${wildcard}`
        );
      })
      .orderBy(state.knex.raw(text))
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
