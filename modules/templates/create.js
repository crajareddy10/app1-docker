/*

URL: /templates/create
METHOD: post
INPUTS: template
FUNCTIONS: create template
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const insertTemplate = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;
    const body = event.body;
    const name = body.name;
    const userId = state.logged_in_user_id;

    const template = {
      name,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(template)
      .into("templates")
      .then((id) => {
        state.template_id = id[0];
        console.log(state.template_id, id[0]);
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertTemplate

const cloneCategories = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const project_id = body.project_id;

    state.knex
      .select(
        "id",
        "name",
        "code",
        "default_markup_bp",
        "default_insurance_bp",
        "default_hourday_id",
        "default_fringe_pw_bp",
        "default_fringe_2_bp",
        "default_taxable_in_cents",
        "default_non_taxable_in_cents"
      )
      .from("categories")
      .where({ project_id: project_id, is_deleted: 0 })
      .then((values) => {
        if (values.length) {
          Promise.mapSeries(values, (category) => {
            // process each individual item here, return a promise
            return insertCategory(state, category);
          })
            .then(() => {
              return resolve(state);
            })
            .catch((err) => {
              return reject(err);
            });
        } else {
          return resolve(state);
        }
      })
      .catch((err) => {
        return reject(err);
      }); //s
  }); // return Promise
}; // cloneCategories

const insertCategory = (state, category) => {
  return new Promise((resolve, reject) => {
    const old_category_id = category.id;
    const event = state.event;
    const body = event.body;
    const project_id = body.project_id;
    const template_id = state.template_id;
    const categoryObj = {
      name: category.name,
      code: category.code,
      template_id: template_id,
      default_markup_bp: category.default_markup_bp,
      default_insurance_bp: category.default_insurance_bp,
      default_hourday_id: category.default_hourday_id,
      default_fringe_pw_bp: category.default_fringe_pw_bp,
      default_fringe_2_bp: category.default_fringe_2_bp,
      default_taxable_in_cents: category.default_taxable_in_cents,
      default_non_taxable_in_cents: category.default_non_taxable_in_cents,
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
    };
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(categoryObj)
      .into("template_categories")
      .then((id) => {
        const categoryId = id[0];
        state.category_ids.push(categoryId);
        state.knex = knexInterface.connect(state.knex);
        state.knex
          .select("number", "days", "name")
          .from("items")
          .where({
            project_id: project_id,
            is_deleted: 0,
            category_id: old_category_id,
          })
          .then((items) => {
            if (items.length) {
              Promise.mapSeries(items, (item) => {
                // process each individual item here, return a promise
                return insertItem(state, item, categoryId);
              })
                .then(() => {
                  return resolve(state);
                })
                .catch((err) => {
                  return reject(err);
                });
            } else {
              return resolve(state);
            }
          })
          .catch((err) => {
            return reject(err);
          }); // state.knex.insert(categoryObj)
      })
      .catch((err) => {
        return reject(err);
      }); // state.knex.insert(categoryObj)
  });
}; // insertCategory

const insertItem = (state, item, categoryId) => {
  return new Promise((resolve, reject) => {
    const name = item.name;
    const number = item.number;
    const days = item.days;
    const template_id = state.template_id;
    const itemObj = {
      category_id: categoryId,
      template_id: template_id,
      name,
      number,
      days,
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
    };
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(itemObj)
      .into("template_items")
      .then((ids) => {
        const itemId = ids[0];
        state.item_ids.push(itemId);
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      }); //state.knex.insert(itemObj)
  });
}; // insertItem

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

    initialState.category_ids = [];
    initialState.item_ids = [];

    insertTemplate(initialState)
      .then(cloneCategories)

      /*****
            MODULE FOOTER START
            **** */
      .then((state) => {
        state.response = "success";
        return resolve(state);
      })
      .catch((err) => {
        const deleteTemplate = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("templates")
              .whereIn("id", [state.template_id])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err2) => {
                return reject(err2);
              });
          });
        }; // deleteTemplate

        const deleteCategories = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("categories")
              .whereIn("template_id", [state.template_id])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err3) => {
                return reject(err3);
              });
          });
        }; // deleteCategories

        const deleteItems = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("items")
              .whereIn("template_id", [state.template_id])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err4) => {
                return reject(err4);
              });
          });
        }; // deleteItems

        deleteTemplate(initialState)
          .then(deleteCategories)
          .then(deleteItems)
          .then(() => {
            return reject(err);
          })
          .catch((err1) => {
            return reject(err1);
          });
      });
  }); // return Promise
};
