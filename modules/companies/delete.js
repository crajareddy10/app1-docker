/*

URL: /companies/{companyId}/delete
METHOD: post
INPUTS: company_id
FUNCTIONS: delete company
OUTPUT: boolean

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const deleteVendor = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;
    const vendor_id = body.id;
    const userId = state.logged_in_user_id;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("companies")
      .update({ is_deleted: 1, updated_by_id: userId })
      .where({
        id: vendor_id,
      })
      .then((result) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // deleteCompany

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

    deleteVendor(initialState)
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
