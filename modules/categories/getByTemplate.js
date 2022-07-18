/*

URL: /categories/get
METHOD: get
INPUTS: project_id
FUNCTIONS: get categories
OUTPUT: array of category objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getCategories = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const templateId = path.templateId;

    if (!templateId) {
      reject(Error("project id missing"));
    } else {
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select(
          "id",
          "name",
          "code",
          "co_id",
          "default_markup_bp",
          "default_insurance_bp",
          "default_hourday_id",
          "default_fringe_pw_bp",
          "default_fringe_2_bp",
          "default_taxable_in_cents",
          "default_non_taxable_in_cents"
        )
        .from("categories")
        .where({
          template_id: templateId,
          is_deleted: 0,
        })
        .then((values) => {
          state.categories = values;

          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }
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

    getCategories(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.categories;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
