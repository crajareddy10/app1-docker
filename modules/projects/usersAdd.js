/*

URL: /projects/{projectId}/users/add
METHOD: post
INPUTS: user_id, role_id
FUNCTIONS: add user to project
OUTPUT: users_projects_id

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getUserId = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    if (!body.user_id && body.contact_id) {
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select("user_id")
        .from("contacts")
        .where({ id: body.contact_id, is_deleted: 0 })
        .then((result) => {
          const userId = result[0].user_id;

          state.body.user_id = userId;

          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    } else {
      // if !user_id && body.contact_id

      return resolve(state);
    }
  }); // return Promise
}; // getUserId

const addUser = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const roleId = body.role_id;

    const insertUserId = body.user_id;

    const projectId = state.path.projectId;

    const action = body.action;

    state.knex = knexInterface.connect(state.knex);
    if (action == "ADD") {
      state.knex
        .insert({
          user_id: insertUserId,
          role_id: roleId,
          project_id: projectId,
          created_by_id: state.logged_in_user_id,
          updated_by_id: state.logged_in_user_id,
        })
        .into("users_projects")
        .then((result) => {
          const projectUserId = result[0];

          state.project_user_id = projectUserId;

          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    } else {
      state
        .knex("users_projects")
        .update({
          role_id: roleId,
          updated_by_id: state.logged_in_user_id,
        })
        .where({
          project_id: projectId,
          user_id: insertUserId,
        })
        .then((result) => {
          state.project_user_id = projectId;

          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // addUser

const updateContact = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const roleId = body.role_id;

    const insertUserId = body.user_id;

    const projectId = state.path.projectId;

    const action = body.action;
    if (action == "ADD") {
      return resolve(state);
    } else {
      const name = body.name;

      const spaceIdx = name.indexOf(" ");

      let firstname = "";

      let lastname = "";

      if (!spaceIdx) {
        firstname = name;
      } else {
        firstname = name.substring(0, spaceIdx);

        lastname = name.substring(spaceIdx + 1);
      }
      state.knex = knexInterface.connect(state.knex);
      state
        .knex("contacts")
        .update({
          firstname,
          lastname,
          updated_by_id: state.logged_in_user_id,
        })
        .where({
          user_id: insertUserId,
        })
        .then((result) => {
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // updateContact

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

    getUserId(initialState)
      .then(addUser)
      .then(updateContact)

      /*****
        MODULE FOOTER START
        **** */
      .then((state) => {
        state.response = state.project_user_id;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
