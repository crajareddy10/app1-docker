/*

URL: /users/updatePassword
METHOD: post
INPUTS: user fields
FUNCTIONS: update user password
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

const hashing = require("../../utils/Hashing");

/* ****
PROMISES START
*** */

const updateUser = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const userUpdatedId = path.userId;

    const hashingVal = state.hashing;

    console.log(hashingVal, "hashingVal");

    if (!body.password) {
      reject(Error("Password is missing"));
    }

    const userId = state.logged_in_user_id;

    let update = {
      is_active: body.is_active,
      is_confirmed: body.is_confirmed,
      hashed_password: hashingVal.hash,
      updated_by_id: userId,
      password_salt: body.password_salt,
    };

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("users")
      .update(update)
      .where({
        id: userUpdatedId,
      })
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
    const body = initialState.body;
    if (!body.password) {
      body.password = hashing.random();
    }
    initialState.body.password_salt = hashing.random();
    initialState.hashing = {};
    initialState.hashing.plain = `${body.password}${initialState.body.password_salt}`;

    hashing
      .hash(initialState) // hash password
      .then(updateUser)

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
