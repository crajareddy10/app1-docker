/*

URL: /users/get/{user_id}
METHOD: get
INPUTS:
FUNCTIONS: get user
OUTPUT: user object

*/

const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getUser = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const userId = path.userId;

    if (!userId) {
      reject(Error("user id missing"));
    } else {
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select("*")
        .from("users")
        .where({ id: userId, is_deleted: 0 })
        .then((values) => {
          if (values.length) {
            state.user = {
              fields: {},
              children: {},
            };

            const user = values[0];

            state.user.fields = user;

            return resolve(state);
          }

          return reject(Error("user not found"));
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // getUser

const getContact = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const userId = path.userId;

    if (!userId) {
      reject(Error("user id missing"));
    } else {
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select("*")
        .from("contacts")
        .where({ user_id: userId, is_deleted: 0 })
        .then((values) => {
          if (values.length) {
            const contact = values[0];

            state.user.contact = contact;

            return resolve(state);
          }

          return reject(Error("user not found"));
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // getContact

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

    getUser(initialState)
      .then(getContact)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.user;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
