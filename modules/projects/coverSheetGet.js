/*

URL: /project/{project_id}/coversheet
METHOD: get
INPUTS: project_id
FUNCTIONS: get coversheet
OUTPUT:  coversheet objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getCoverSheetHeader = (state) => {
  return new Promise((resolve, reject) => {
    const projectId = state.event.params.projectId;

    state.knex = knexInterface.connect(state.knex);
    var query = state.knex
      .select(
        "id",
        "pc_name",
        "pc_addrs",
        "pc_phone",
        "ex_prod_1",
        "ex_prod_2",
        "direcotor",
        "dop",
        "editor",
        "other_1",
        "other_2",
        "other_3",
        "payment_terms",
        "business_affairs",
        "ecd",
        "creative_dir",
        "copywriter_ad",
        "product",
        "ot_based_on",
        "shooting_format",
        "delivery_format",
        "delivery_date",
        "shooting_dates"
      )
      .from("coversheet_projects")
      .where({ project_id: projectId });
    query
      .then((values) => {
        state.coversheet = "";
        if (values.length) {
          state.coversheet = values[0];
        }
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getCompany

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

    getCoverSheetHeader(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.coversheet;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
