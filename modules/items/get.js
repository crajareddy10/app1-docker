/*

URL: /items/get
METHOD: get
INPUTS: category_id
FUNCTIONS: get items
OUTPUT: array of item objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getItems = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const event = state.event;

    const path = event.params;

    const categoryId = path.categoryId;

    if (!categoryId) {
      reject(Error("category id missing"));
    } else {
      // insert ignore
      // if ignore, select to get id
      let where = { "items.category_id": categoryId, "items.is_deleted": 0 };
      if (path.co_id) {
        where = {
          "items.category_id": categoryId,
          "items.is_deleted": 0,
          "items_cos.log_id": path.co_id,
        };
      }
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select(
          "items.id",
          "items.category_id",
          "items.number",
          "items.days",
          "items.rate",
          "items.name",
          "items.co_id",
          "cos.is_approved",
          "items_cos.is_new",
          "items_cos.log_id as cologid"
        )
        .from("items")
        .leftJoin("items_cos", "items.id", "items_cos.item_id")
        .leftJoin("cos", "items_cos.log_id", "cos.id")
        .where(where)
        .then((values) => {
          state.items = values;

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

    getItems(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.items;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
