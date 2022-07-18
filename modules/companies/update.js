/*

URL: /companies/update
METHOD: post
INPUTS: company fields
FUNCTIONS: update company
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateCompany = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    delete body.id;

    const path = event.params;

    const companyId = path.companyId;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("companies")
      .update(body)
      .where({
        id: companyId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Contact not updated."));
        }
        body.id = companyId;
        state.company = body;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateCompany

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

    updateCompany(initialState)
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
