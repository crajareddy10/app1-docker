/*

URL: /items/update
METHOD: post
INPUTS: item fields
FUNCTIONS: update item
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateItem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    delete body.id;

    const path = event.params;

    const itemId = path.itemId;

    const userId = state.logged_in_user_id;

    const item = {
      name: body.name,
      number: body.number,
      days: body.days,
      rate: body.rate,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("items")
      .update(item)
      .where({
        id: itemId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Item not updated."));
        }
        state.item = item;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateItem

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

    updateItem(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = "success";
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      }); // catch
  }); // return Promise
};
