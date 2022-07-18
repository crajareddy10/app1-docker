/*

URL: /subitems/get
METHOD: get
INPUTS: item_id
FUNCTIONS: get subitems
OUTPUT: array of subitem objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getSubitems = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const itemId = path.itemId;

    const logId = path.logId;

    if (!itemId && !logId) {
      if (!logId) {
        reject(Error("log id missing"));
      }
      if (!itemId) {
        reject(Error("item id missing"));
      }
    } else {
      let condition = "";
      if (logId && itemId) {
        const typeId = path.typeId;
        condition = {
          "subitems.log_id": logId,
          "subitems.item_id": itemId,
          "subitems.is_deleted": 0,
        };
      } else if (logId) {
        const typeId = path.typeId;
        condition = {
          "subitems.log_id": logId,
          "subitems.type_id": typeId,
          "subitems.is_deleted": 0,
        };
      } else {
        condition = { "subitems.item_id": itemId, "subitems.is_deleted": 0 };
      }
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select(
          "subitems.id",
          "subitems.item_id",
          "subitems.vendor_id",
          "subitems.phase_id",
          "subitems.type_id",
          "subitems.log_id",
          "subitems.co_id",
          "subitems.is_paid",
          "subitems.name",
          "subitems.note",
          "subitems.subitem_date",
          "subitems.receipt_img",
          "subitems.qty",
          "subitems.rate_in_cents",
          "subitems.markup_bp",
          "subitems.insurance_bp",
          "subitems.hourday_id",
          "subitems.fringe_pw_bp",
          "subitems.fringe_2_bp",
          "subitems.taxable_in_cents",
          "subitems.non_taxable_in_cents",
          "items.number as item_number",
          "items.name as item_name",
          "contacts.firstname",
          "contacts.lastname",
          "contacts.email",
          "contacts.phone",
          "cos.is_approved"
        )
        .from("subitems")
        .innerJoin("items", "subitems.item_id", "items.id")
        .leftJoin("contacts", "subitems.vendor_id", "contacts.id")
        .leftJoin("cos", "subitems.log_id", "cos.id")
        .where(condition)
        .then((values) => {
          state.subitems = values;

          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // getProject

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

    getSubitems(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.subitems;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
