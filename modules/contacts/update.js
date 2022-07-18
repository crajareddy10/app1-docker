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

const updateContact = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    delete body.id;

    delete body.is_confirmed;

    delete body.is_active;

    delete body.email;

    delete body.user_id;

    const path = event.params;

    const contactId = path.contactId;

    const name = body.name;

    const company_name = body.company_name;

    delete body.company_name;

    if (body.name) {
      const spaceIdx = name.indexOf(" ");

      if (!spaceIdx) {
        body.firstname = name;
      } else {
        body.firstname = name.substring(0, spaceIdx);

        body.lastname = name.substring(spaceIdx + 1);
      }
    }

    delete body.name;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("contacts")
      .update(body)
      .where({
        id: contactId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Contact not updated."));
        }
        body.id = contactId;
        body.name = name || "";
        body.company_name = company_name || "";
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

    updateContact(initialState)
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
