/*

URL: /items/create
METHOD: post
INPUTS: item
FUNCTIONS: create item
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const insertItem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const name = body.fields.name;
    const number = body.fields.number;
    const days = body.fields.days;
    const rate = body.fields.rate;
    const category_id = body.category_id;
    const project_id = body.project_id || 0;
    const template_id = body.template_id || 0;

    const co_id = body.fields.co_id ? body.fields.co_id : 0;

    const userId = state.logged_in_user_id;

    const item = {
      category_id,
      project_id,
      template_id,
      name,
      number,
      days,
      rate,
      co_id,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(item)
      .into("items")
      .then((id) => {
        item.id = id[0];
        state.item = {
          id: item.id,
          name: item.name,
          number: item.number,
          days: item.days,
          rate: item.rate,
        };

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertItem

const addItem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const co_id = body.fields.co_id ? body.fields.co_id : 0;

    const itemId = state.item.id;

    if (co_id > 0) {
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert({
          item_id: itemId,
          log_id: co_id,
          is_new: 1,
          created_by_id: state.logged_in_user_id,
          updated_by_id: state.logged_in_user_id,
        })
        .into("items_cos")
        .then((result) => {
          const LogItemId = result[0];

          state.log_item_id = LogItemId;
          return resolve(state);
        }) // then update
        .catch((err) => {
          return reject(err);
        });
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // addItem

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

    insertItem(initialState)
      .then(addItem)

      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.item;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
