/*

URL: /subitems/update
METHOD: post
INPUTS: subitem fields
FUNCTIONS: update subitem
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateSubitem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    delete body.id;
    if (!body.item_id) {
      return reject(Error("Item is missing"));
    }
    if (body.item_number || body.item_name) {
      delete body.item_number;
      delete body.item_name;
    }
    delete body.display;

    delete body.firstname;

    delete body.lastname;

    delete body.email;

    delete body.phone;

    delete body.user_id;

    const is_approved = body.is_approved;

    delete body.is_approved;

    const path = event.params;

    const subitemId = path.subitemId;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    if (body.subitem_date && body.subitem_date.includes("Z")) {
      delete body.subitem_date;
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("subitems")
      .update(body)
      .where({
        id: subitemId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Subitem not updated."));
        }
        body.is_approved = is_approved;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateSubitem

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

    updateSubitem(initialState)
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
