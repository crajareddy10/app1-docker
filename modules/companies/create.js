/*

URL: /companies/create
METHOD: post
INPUTS: company
FUNCTIONS: create company
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

const { v4: uuidv4 } = require("uuid");

/* ****
PROMISES START
*** */

const insertClient = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const name = body.name;

    const userId = state.logged_in_user_id;

    const company = {
      name,
      owner_id: userId,
      created_by_id: userId,
      updated_by_id: userId,
      uuid: uuidv4(),
      email: body.email || uuidv4(),
      address1: body.address1 || "",
      address2: body.address2 || "",
      city: body.city || "",
      state: body.state || "",
      zip: body.zip || "",
      phone: body.phone || "",
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(company)
      .into("companies")
      .then((ids) => {
        const id = ids[0];
        company.id = id;
        state.company = company;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
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

    insertClient(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.company;
        return resolve(state);
      });
  }); // return Promise
};
