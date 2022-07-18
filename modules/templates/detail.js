/*

URL: /projects/get/{project_id}
METHOD: get
INPUTS:
FUNCTIONS: get project
OUTPUT: project object

*/

const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getTemplate = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const templateId = path.templateId;

    if (!templateId) {
      reject(Error("template id missing"));
    } else {
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select("id", "name")
        .from("templates")
        .where({ id: templateId, is_deleted: 0 })
        .then((values) => {
          if (values.length) {
            state.template = {
              fields: {},
            };

            const templateFields = values[0];

            state.template.fields = templateFields;

            return resolve(state);
          }

          return reject(Error("template not found"));
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // getTemplate

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

    getTemplate(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.template;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
