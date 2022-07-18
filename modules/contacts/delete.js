/*

URL: /contacts/{contactId}/delete
METHOD: post
INPUTS: contact_id
FUNCTIONS: delete contact
OUTPUT: boolean

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const deleteContact = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;
    const contact_id = body.id;
    const userId = state.logged_in_user_id;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("contacts")
      .update({ is_deleted: 1, updated_by_id: userId })
      .where({
        id: contact_id,
      })
      .then((result) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // deleteContact

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

    deleteContact(initialState)
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
