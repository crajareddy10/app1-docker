/*

URL: /projects/{project_id}/coversheet/add
METHOD: post
INPUTS: project
FUNCTIONS: create/update coversheet header
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const insertCoverSheet = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const userId = state.logged_in_user_id;

    const projectId = state.path.projectId;

    const sheet = {
      created_by_id: userId,
      updated_by_id: userId,
      project_id: projectId,
      ...body,
    };

    if (body.id) {
      const id = body.id;
      delete sheet.id;
      state.knex = knexInterface.connect(state.knex);
      state
        .knex("coversheet_projects")
        .update(sheet)
        .where({ id })
        .then(() => {
          state.coversheet_id = id;
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    } else {
      delete sheet.id;
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert(sheet)
        .into("coversheet_projects")
        .then((ids) => {
          state.coversheet_id = ids[0];
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // insertClient

/* ****
PROMISES END
*** */

/* ****
MODULE HEADER START
**** */

module.exports = (initialState) => {
  return new Promise((resolve) => {
    /* ****
    MODULE HEADER END
    **** */

    insertCoverSheet(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = { sucess: true, id: state.coversheet_id };
        return resolve(state);
      });
  }); // return Promise
};
