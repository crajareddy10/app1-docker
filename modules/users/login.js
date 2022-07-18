/*

URL: /users/login
METHOD: post
INPUTS: username, password
OUTPUT: token

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

const hashing = require("../../utils/Hashing");

/* ****
PROMISES START
*** */

const login = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    if (process.env.ENV !== "dev" && state.event.headers.Cookie) {
      /*CHECK CSRF COOKIE*/
      const postCSRF = body.csrf;

      const cookieName = process.env.CSRF_COOKIE;

      let cookieCSRF = state.event.headers.Cookie;

      cookieCSRF = cookieCSRF.replace(`${cookieName}=`, "");

      if (!postCSRF || !cookieCSRF || postCSRF !== cookieCSRF) {
        reject(Error("CSRF error"));
      }
    }

    const email = body.email;
    const password = body.password;

    state.knex = knexInterface.connect(state.knex);

    state.knex
      .select("id", "password_salt", "hashed_password", "is_confirmed")
      .from("users")
      .where({ email, is_deleted: 0 })
      .limit(1)
      .orderBy("id", "desc")
      .then((values) => {
        if (values.length) {
          const value = values[0];

          state.hashing = {};

          state.hashing.plain = `${password}${value.password_salt}`;
          state.hashing.hash = value.hashed_password;

          state.logged_in_user_id = value.id;

          state.is_confirmed = value.is_confirmed;

          return resolve(state);
        } // if values length

        reject(Error("user_not_found"));
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // login

const checkConfirmed = (state) => {
  return new Promise((resolve, reject) => {
    const is_confirmed = state.is_confirmed;

    if (is_confirmed != 1) {
      reject(Error("user_not_confirmed"));
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // login

const setSession = (state) => {
  return new Promise((resolve, reject) => {
    state.session = {};

    const userId = state.logged_in_user_id;

    state.session.user_id = userId;

    const random = hashing.random();

    //parsing in the user id just to ensure every key is unique to one user
    const sessionKey = `${random}${userId}`;

    state.session.session_key = sessionKey;

    const csrfKey = hashing.random();

    /*SET NEW CSRF COOKIE*/

    state.session.csrf_key = csrfKey;

    const now = Date.now();

    state.hashing.plain = `${sessionKey}${now}`;

    state.session.session_ms = now;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(state.session)
      .into("users_sessions")
      .then(() => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // setSession

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

    login(initialState)
      .then(hashing.compare) // compare submitted password
      .then(checkConfirmed)
      .then(setSession)
      .then(hashing.hash) // hash session key and time

      /* ****
      MODULE FOOTER START
      **** */
      .then((state) => {
        const token = `${state.session.session_key}|${state.session.session_ms}|${state.hashing.hash}`;

        state.response = token;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
