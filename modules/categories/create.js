/*

URL: /cateogories/create
METHOD: post
INPUTS: category
FUNCTIONS: create contact
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const insertCateogy = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const name = body.fields.name;
    const code = body.fields.code;
    const project_id = body.project_id;
    const template_id = body.template_id;
    const co_id = body.fields.co_id ? body.fields.co_id : 0;
    const default_markup_bp = body.fields.default_markup_bp;
    const default_insurance_bp = body.fields.default_insurance_bp;
    const default_hourday_id = body.fields.default_hourday_id;
    const default_fringe_pw_bp = body.fields.default_fringe_pw_bp;
    const default_fringe_2_bp = body.fields.default_fringe_2_bp;
    const default_taxable_in_cents = body.fields.default_taxable_in_cents;
    const default_non_taxable_in_cents =
      body.fields.default_non_taxable_in_cents;

    const userId = state.logged_in_user_id;

    const category = {
      project_id: project_id || 0,
      template_id: template_id || 0,
      name,
      code,
      co_id,
      default_markup_bp,
      default_insurance_bp,
      default_hourday_id,
      default_fringe_pw_bp,
      default_fringe_2_bp,
      default_taxable_in_cents,
      default_non_taxable_in_cents,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(category)
      .into("categories")
      .then((id) => {
        category.id = id[0];
        state.category = category;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertCateogy

const addCategory = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const co_id = body.fields.co_id ? body.fields.co_id : 0;

    const categoryId = state.category.id;

    if (co_id > 0) {
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert({
          category_id: categoryId,
          log_id: co_id,
          is_new: 1,
          created_by_id: state.logged_in_user_id,
          updated_by_id: state.logged_in_user_id,
        })
        .into("categories_cos")
        .then((result) => {
          const LogCategoryId = result[0];

          state.log_category_id = LogCategoryId;
          return resolve(state);
        }) // then update
        .catch((err) => {
          return reject(err);
        });
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // addCategory

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

    insertCateogy(initialState)
      .then(addCategory)

      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.category;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
