/*

URL: /contacts/create
METHOD: post
INPUTS: contact
FUNCTIONS: create contact
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

const { v4: uuidv4 } = require("uuid");

/* ****
PROMISES START
*** */

const insertSubitem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    if (!body.fields.item_id) {
      return reject(Error("Item is missing"));
    }

    const name = body.fields.name;
    const note = body.fields.note;
    const subitem_date = body.fields.subitem_date
      ? body.fields.subitem_date
      : new Date();
    const receipt_img = body.fields.receipt_img;
    const qty = body.fields.qty;
    const rate_in_cents = body.fields.rate_in_cents;
    const markup_bp = body.fields.markup_bp;
    const insurance_bp = body.fields.insurance_bp;
    const hourday_id = body.fields.hourday_id;
    const fringe_pw_bp = body.fields.fringe_pw_bp;
    const fringe_2_bp = body.fields.fringe_2_bp;
    const taxable_in_cents = body.fields.taxable_in_cents;
    const non_taxable_in_cents = body.fields.non_taxable_in_cents;
    const item_id = body.fields.item_id || 0;
    const log_id = body.fields.log_id || 0;
    const co_id = body.fields.co_id || 0;
    const type_id = body.fields.type_id || 0;
    const phase_id = body.fields.phase_id || null;
    const is_paid = body.fields.is_paid || 0;
    const vendor_id = body.fields.vendor_id || null;
    const userId = state.logged_in_user_id;

    const subitem = {
      item_id,
      log_id,
      co_id,
      phase_id,
      name,
      note,
      subitem_date,
      receipt_img,
      type_id,
      is_paid,
      vendor_id,
      qty,
      rate_in_cents,
      markup_bp,
      insurance_bp,
      hourday_id,
      fringe_pw_bp,
      fringe_2_bp,
      taxable_in_cents,
      non_taxable_in_cents,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(subitem)
      .into("subitems")
      .then((id) => {
        subitem.id = id[0];
        state.subitem = subitem;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertContact

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

    insertSubitem(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.subitem;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
