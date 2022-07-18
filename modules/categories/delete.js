/*

URL: /categories/{categoryId}/delete
METHOD: post
INPUTS: category_id
FUNCTIONS: delete category from project
OUTPUT: boolean

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const deleteCategory = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;
    const category_id = body.category_id;
    const userId = state.logged_in_user_id;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("categories")
      .update({ is_deleted: 1, updated_by_id: userId })
      .where({
        id: category_id,
      })
      .then((result) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // deleteCategory

// deleteItems
const deleteItems = (state) => {
  return new Promise((resolve, reject) => {
    const userId = state.logged_in_user_id;
    state.knex = knexInterface.connect(state.knex);
    state
      .knex("items")
      .whereIn("category_id", [state.body.category_id])
      .update({ is_deleted: 1, updated_by_id: userId })
      .then(() => {
        return resolve(state);
      })
      .catch((err4) => {
        return reject(err4);
      });
  });
};
// deleteSubitems
const deleteSubitems = (state) => {
  return new Promise((resolve, reject) => {
    const userId = state.logged_in_user_id;
    state.knex = knexInterface.connect(state.knex);
    state
      .knex("subitems")
      .whereIn("item_id", state.items)
      .update({ is_deleted: 1, updated_by_id: userId })
      .then(() => {
        return resolve(state);
      })
      .catch((err5) => {
        return reject(err5);
      });
  });
};
const getItems = (state) => {
  return new Promise((resolve, reject) => {
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select("id")
      .from("items")
      .where({ category_id: state.body.category_id, is_deleted: 0 })
      .then((ids) => {
        let items = [];
        if (ids.length > 0) {
          ids.forEach((i) => {
            items.push(i.id);
          });
        }
        state.items = items;
        return resolve(state);
      })
      .catch((err5) => {
        return reject(err5);
      });
  });
};

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
    initialState.items = [];

    deleteCategory(initialState)
      /*****
        MODULE FOOTER START
        **** */
      .then(getItems)
      .then(deleteItems)
      .then(deleteSubitems)
      .then((state) => {
        state.response = state.id;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
