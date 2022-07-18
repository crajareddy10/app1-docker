/*

URL: /templates/get
METHOD: get
FUNCTIONS: get templates
OUTPUT: array of template objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getTemplates = (state) => {
  return new Promise((resolve, reject) => {
    const userId = state.logged_in_user_id;

    const event = state.event;

    const query = event.query;

    state.knex = knexInterface.connect(state.knex);
    const q = state.knex
      .select("id", "name as text")
      .from("templates")
      .where({ is_deleted: 0 });
    if (query.searchterm) {
      q.whereRaw(`(name like '%${query.searchterm}%')`);
    }
    q.then((values) => {
      state.templates = values;

      return resolve(state);
    }).catch((err) => {
      return reject(err);
    });
  }); // return Promise
}; // getTemplates

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

    getTemplates(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.templates;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
