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

const deleteUser = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const insertUserId = body.user_id;

    const projectId = state.path.projectId;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("users_projects")
      .delete()
      .where({
        project_id: projectId,
        user_id: insertUserId,
      })
      .then((result) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // addUser

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

    deleteUser(initialState)
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
