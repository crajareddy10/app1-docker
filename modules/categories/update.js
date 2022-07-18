/*

URL: /categories/update
METHOD: post
INPUTS: category fields
FUNCTIONS: update category
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateCategory = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    //delete body.id

    const path = event.params;

    const categoryId = body.id;

    const userId = state.logged_in_user_id;

    const category = {
      id: body.id,
      name: body.name,
      code: body.code,
      default_markup_bp: body.default_markup_bp,
      default_insurance_bp: body.default_insurance_bp,
      default_hourday_id: body.default_hourday_id,
      default_fringe_pw_bp: body.default_fringe_pw_bp,
      default_fringe_2_bp: body.default_fringe_2_bp,
      default_taxable_in_cents: body.default_taxable_in_cents,
      default_non_taxable_in_cents: body.default_non_taxable_in_cents,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("categories")
      .update(category)
      .where({
        id: categoryId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Category not updated."));
        }
        state.category = category;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateSubitem

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

    updateCategory(initialState)
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
