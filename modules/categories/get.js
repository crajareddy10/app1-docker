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
    const body = state.body;

    const event = state.event;

    const path = event.params;

    const uuid = path.projectId;

    const co_id = path.co_id;

    let where;

    if (!uuid) {
      reject(Error("project id missing"));
    } else {
      if (co_id) {
        where = {
          "projects.uuid": uuid,
          "categories.is_deleted": 0,
          "projects.is_deleted": 0,
          "categories_cos.log_id": co_id,
        };
      } else {
        where = {
          "projects.uuid": uuid,
          "categories.is_deleted": 0,
          "projects.is_deleted": 0,
        };
      }
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select(
          "categories.id",
          "categories.name",
          "categories.code",
          "categories.co_id",
          "categories.default_markup_bp",
          "categories.default_insurance_bp",
          "categories.default_hourday_id",
          "categories.default_fringe_pw_bp",
          "categories.default_fringe_2_bp",
          "categories.default_taxable_in_cents",
          "categories.default_non_taxable_in_cents",
          "cos.is_approved",
          "categories_cos.is_new",
          "categories_cos.log_id as cologid"
        )
        .from("categories")
        .innerJoin("projects", "categories.project_id", "projects.id")
        .leftJoin(
          "categories_cos",
          "categories.id",
          "categories_cos.category_id"
        )
        .leftJoin("cos", "categories_cos.log_id", "cos.id")
        .where(where)
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
