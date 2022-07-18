/*

URL: /items/{itemId}/delete
METHOD: post
INPUTS: item_id
FUNCTIONS: delete item from project
OUTPUT: boolean

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const deleteItem = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const item_id = body.item_id;

    const userId = state.logged_in_user_id;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("items")
      .update({ is_deleted: 1, updated_by_id: userId })
      .where({
        id: item_id,
      })
      .then((result) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // deleteItem

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

    deleteItem(initialState)
      /*****
        MODULE FOOTER START
        **** */
      .then((state) => {
        state.response = state.id;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
