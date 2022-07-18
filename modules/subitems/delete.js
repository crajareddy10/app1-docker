/*

URL: /projects/{projectId}/users/delete
METHOD: post
INPUTS: user_id
FUNCTIONS: delete user from project
OUTPUT: boolean

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const deleteSubitem = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const subitem_id = body.subitem_id;

    const userId = state.logged_in_user_id;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("subitems")
      .update({ is_deleted: 1, updated_by_id: userId })
      .where({
        id: subitem_id,
      })
      .then((result) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // deleteSubitem

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

    deleteSubitem(initialState)
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
