/*

URL: /contacts/update
METHOD: post
INPUTS: contact fields
FUNCTIONS: update contact
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateUser = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const userUpdatedId = body.user_id;

    const userId = state.logged_in_user_id;

    const path = event.params;

    let update = {
      is_active: body.is_active,
      is_confirmed: body.is_confirmed,
      updated_by_id: userId,
    };

    let where = {
      id: userUpdatedId,
    };

    if (body.uuid && body.uuid == path.userId) {
      update = {
        is_confirmed: body.is_confirmed,
        is_active: body.is_active,
      };
      where = {
        uuid: body.uuid,
      };
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("users")
      .update(update)
      .where(where)
      .then((result) => {
        if (!result) {
          return reject(Error("User not updated."));
        }
        state.contact = body;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateContact

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

    updateUser(initialState)
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
