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

    const projectId = query.project_id;

    if (query.category_id == null || query.category_id == undefined) {
      query.category_id = null;
    }

    const categoryId = query.category_id;

    const exact = path.exact;

    let operator = "like";

    let wildcard = "%";

    if (exact) {
      operator = "=";
      wildcard = "";
    }

    let where = { "items.project_id": projectId, "items.is_deleted": 0 };

    if (categoryId) {
      where = {
        "items.category_id": categoryId,
        "items.project_id": projectId,
        "items.is_deleted": 0,
      };
    }

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select(
        "items.id",
        "items.name as text",
        "items.name",
        "items.number",
        "items.days",
        "categories.default_markup_bp as markup_bp ",
        "categories.default_insurance_bp as insurance_bp",
        "categories.default_hourday_id as hourday_id",
        "categories.default_fringe_pw_bp as fringe_pw_bp",
        "categories.default_fringe_2_bp as fringe_2_bp",
        "categories.default_taxable_in_cents as taxable_in_cents",
        "categories.default_non_taxable_in_cents as non_taxable_in_cents"
      )
      .from("items")
      .leftJoin("categories", "items.category_id", "categories.id")
      .where(where)
      .andWhere("items.name", operator, `${wildcard}${searchText}${wildcard}`)
      .orderBy("items.name")
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
