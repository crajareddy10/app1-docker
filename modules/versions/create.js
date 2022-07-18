/*

URL: /templates/create
METHOD: post
INPUTS: template
FUNCTIONS: create template
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");
const { v4: uuidv4 } = require("uuid");

/* ****
PROMISES START
*** */

const getProjects = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;
    const body = event.body;
    const version = body.name;
    const userId = state.logged_in_user_id;
    const project_id = body.project_id;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select(
        "id",
        "owner_id",
        "client_id",
        "contact_id",
        "lp_id",
        "pm_id",
        "phase_id",
        "number",
        "name",
        "default_rate_type_id",
        "default_hours_in_day",
        "default_fringe_pw_bp",
        "default_fringe_2_bp",
        "default_markup_bp",
        "default_insurance_bp",
        "event_date"
      )
      .from("projects")
      .where({ id: project_id, is_deleted: 0 })
      .then((project) => {
        const puuid = uuidv4();
        const newproj = {
          owner_id: project[0].owner_id,
          client_id: project[0].client_id,
          contact_id: project[0].contact_id,
          lp_id: project[0].lp_id,
          pm_id: project[0].pm_id,
          phase_id: project[0].phase_id,
          number: project[0].number,
          name: project[0].name,
          default_rate_type_id: project[0].default_rate_type_id,
          default_hours_in_day: project[0].default_hours_in_day,
          default_fringe_pw_bp: project[0].default_fringe_pw_bp,
          default_fringe_2_bp: project[0].default_fringe_2_bp,
          default_markup_bp: project[0].default_markup_bp,
          default_insurance_bp: project[0].default_insurance_bp,
          event_date: project[0].event_date,
          uuid: puuid,
          version: version,
          created_by_id: userId,
          updated_by_id: userId,
        };
        state.knex = knexInterface.connect(state.knex);
        state.knex
          .insert(newproj)
          .into("projects")
          .then((id) => {
            const projectId = id[0];
            state.projectId = projectId;
            state.uuid = puuid;
            return resolve(state);
          })
          .catch((err) => {
            return reject(err);
          }); //s
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

    state.knex = knexInterface.connect(state.knex);
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
    const projectId = state.projectId;
    const categoryObj = {
      name: category.name,
      code: category.code,
      project_id: projectId,
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
      .into("categories")
      .then((id) => {
        const categoryId = id[0];
        state.category_ids.push(categoryId);
        state.knex = knexInterface.connect(state.knex);
        state.knex
          .select("id", "number", "days", "name")
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
    const old_item_id = item.id;
    const name = item.name;
    const number = item.number;
    const days = item.days;
    const projectId = state.projectId;
    const itemObj = {
      category_id: categoryId,
      project_id: projectId,
      name,
      number,
      days,
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
    };
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(itemObj)
      .into("items")
      .then((ids) => {
        const itemId = ids[0];
        state.item_ids.push(itemId);
        state.knex = knexInterface.connect(state.knex);
        state.knex
          .select(
            "original_id",
            "item_id",
            "vendor_id",
            "phase_id",
            "type_id",
            "log_id",
            "co_id",
            "is_paid",
            "how_paid",
            "terms",
            "partial_payment",
            "name",
            "note",
            "subitem_date",
            "receipt_img",
            "qty",
            "rate_in_cents",
            "markup_bp",
            "insurance_bp",
            "hourday_id",
            "fringe_pw_bp",
            "fringe_2_bp",
            "taxable_in_cents"
          )
          .from("subitems")
          .where({ is_deleted: 0, item_id: old_item_id })
          .then((subitems) => {
            if (subitems.length) {
              Promise.mapSeries(subitems, (subitem) => {
                // process each individual item here, return a promise
                return insertSubItem(state, subitem, itemId);
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
          }); //
      })
      .catch((err) => {
        return reject(err);
      }); //state.knex.insert(itemObj)
  });
}; // insertItem

const insertSubItem = (state, subitem, itemId) => {
  return new Promise((resolve, reject) => {
    const name = subitem.name;
    const note = subitem.note;
    const subitem_date = subitem.subitem_date;
    const receipt_img = subitem.receipt_img;
    const qty = subitem.qty;
    const rate_in_cents = subitem.rate_in_cents;
    const markup_bp = subitem.markup_bp;
    const insurance_bp = subitem.insurance_bp;
    const hourday_id = subitem.hourday_id;
    const fringe_pw_bp = subitem.fringe_pw_bp;
    const fringe_2_bp = subitem.fringe_2_bp;
    const taxable_in_cents = subitem.taxable_in_cents;
    const non_taxable_in_cents = subitem.non_taxable_in_cents;
    const log_id = subitem.log_id;
    const co_id = subitem.co_id;
    const type_id = subitem.type_id;
    const phase_id = subitem.phase_id;
    const is_paid = subitem.is_paid;
    const vendor_id = subitem.vendor_id;

    const subitemObj = {
      item_id: itemId,
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
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
    };
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(subitemObj)
      .into("subitems")
      .then((ids) => {
        const subitemId = ids[0];
        state.subitem_ids.push(subitemId);
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      }); //state.knex.insert(itemObj)
  });
}; // insertSubItem

const cloneUsers = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const project_id = body.project_id;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select("id", "user_id", "role_id")
      .from("users_projects")
      .where({ project_id: project_id, is_deleted: 0 })
      .then((values) => {
        if (values.length) {
          Promise.mapSeries(values, (user) => {
            // process each individual item here, return a promise
            return insertUser(state, user);
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
}; // cloneUsers

const insertUser = (state, user) => {
  return new Promise((resolve, reject) => {
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert({
        user_id: user.user_id,
        role_id: user.role_id,
        project_id: state.projectId,
        created_by_id: state.logged_in_user_id,
        updated_by_id: state.logged_in_user_id,
      })
      .into("users_projects")
      .then((result) => {
        const projectUserId = result[0];
        state.user_ids.push(projectUserId);
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertUser

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
    initialState.subitem_ids = [];
    initialState.user_ids = [];

    getProjects(initialState)
      .then(cloneCategories)
      .then(cloneUsers)
      /*****
            MODULE FOOTER START
            **** */
      .then((state) => {
        state.response = state.uuid;
        return resolve(state);
      })
      .catch((err) => {
        const deleteProject = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("projects")
              .whereIn("id", [state.projectId])
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
              .whereIn("project_id", [state.projectId])
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
              .whereIn("project_id", [state.projectId])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err4) => {
                return reject(err4);
              });
          });
        }; // deleteItems

        const deleteSubItems = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("subitems")
              .whereIn("item_id", [state.item_ids])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err5) => {
                return reject(err5);
              });
          });
        }; // deleteSubItems

        const deleteUsers = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("users_projects")
              .whereIn("project_id", [state.projectId])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err7) => {
                return reject(err7);
              });
          });
        }; // deleteProjec

        deleteProject(initialState)
          .then(deleteCategories)
          .then(deleteItems)
          .then(deleteSubItems)
          .then(deleteUsers)
          .then(() => {
            return reject(err);
          })
          .catch((err1) => {
            return reject(err1);
          });
      });
  }); // return Promise
};
