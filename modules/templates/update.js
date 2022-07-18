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

const updateTemplate = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const templateId = path.templateId;

    const body = event.body;

    delete body.id;

    const name = body.name;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("templates")
      .update(body)
      .where({
        id: templateId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Template not updated."));
        }
        body.id = templateId;
        body.name = name || "";
        state.template = body;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateTemplate

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

    updateTemplate(initialState)
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
