/*

URL: /projects/create
METHOD: post
INPUTS: project
FUNCTIONS: create project
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");
const _ = require("lodash");

const Validation = require("../../utils/Validation");
const Conversion = require("../../utils/Conversion");

const Components = require("../../data/Components");

const { v4: uuidv4 } = require("uuid");

/* ****
PROMISES START
*** */

const insertClient = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const fields = body.fields;

    const ownerId = fields.owner_id;

    const clientId = fields.client_id;

    if (clientId) {
      return resolve(state);
    }

    const newFields = body.newFields;

    const client = newFields.client;

    // insert ignore
    // if ignore, select to get id
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert({
        name: client,
        user_id: ownerId,
        owner_id: state.logged_in_user_id,
        uuid: uuidv4(),
        created_by_id: state.logged_in_user_id,
        updated_by_id: state.logged_in_user_id,
      })
      .into("companies")
      .then((ids) => {
        const id = ids[0];

        state.body.fields.client_id = id;

        return resolve(state);
      })
      .catch((err) => {
        if (err.message.indexOf("companies_user_id_name_is_deleted_unique")) {
          state.knex = knexInterface.connect(state.knex);
          state.knex
            .select("id")
            .from("companies")
            .where({ name: client, user_id: ownerId })
            .then((values) => {
              const id = values[0].id;

              state.body.fields.client_id = id;

              return resolve(state);
            })
            .catch((err2) => {
              return reject(err2);
            });
        } else {
          return reject(err);
        }
      });
  }); // return Promise
}; // insertClient

const insertContact = (state) => {
  return insertContactInner(state, "contact_id");
}; // insertContact

const insertLp = (state) => {
  return insertContactInner(state, "lp_id");
}; // insertLp

const insertPm = (state) => {
  return insertContactInner(state, "pm_id");
}; // insertContact

const insertUser = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert({
        user_id: state.logged_in_user_id,
        role_id: 0,
        project_id: state.project_id,
        created_by_id: state.logged_in_user_id,
        updated_by_id: state.logged_in_user_id,
      })
      .into("users_projects")
      .then((result) => {
        const projectUserId = result[0];

        state.project_user_id = projectUserId;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertUser

const insertProject = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const fields = body.fields;
    const puuid = uuidv4();
    const project = {
      owner_id: state.logged_in_user_id,
      client_id: fields.client_id,
      contact_id: fields.contact_id,
      template_id: parseInt(fields.template_id),
      lp_id: fields.lp_id,
      pm_id: fields.pm_id,
      phase_id: fields.phase_id,
      number: fields.number,
      name: fields.name,
      event_date: fields.event_date ? fields.event_date : new Date(),
      default_rate_type_id: fields.default_rate_type_id,
      default_hours_in_day: fields.default_hours_in_day,
      default_fringe_pw_bp: Conversion.bp(fields.default_fringe_pw_bp),
      default_fringe_2_bp: Conversion.bp(fields.default_fringe_2_bp),
      default_markup_bp: Conversion.bp(fields.default_markup_bp),
      default_insurance_bp: Conversion.bp(fields.default_insurance_bp),
      uuid: puuid,
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(project)
      .into("projects")
      .then((ids) => {
        const id = ids[0];

        state.project_id = id;
        state.uuid = puuid;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertProject

const insertLiveComponent = (state) => {
  return insertComponent(state, "live");
}; // insertLiveComponent

const insertPostComponent = (state) => {
  return insertComponent(state, "post");
}; // insertLiveComponent

const insertTemplateComponent = (state) => {
  return insertComponent(state, "template");
}; // insertTemplateComponent

/* ****
PROMISES END
*** */

/* ****
SHARED FUNCTIONS START
*** */

const insertContactInner = (state, field) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const fields = body.fields;

    const ownerId = fields.owner_id;

    const contactId = fields[field];

    if (contactId) {
      return resolve(state);
    }

    const newFields = body.newFields;

    const contact = newFields.contact;

    let contactArr = [];

    let lastname = "";
    let firstname = "";
    let email = "";

    // if comma present,
    // explode name on comma
    if (contact.indexOf(",")) {
      contactArr = contact.split(",");

      // else explode name on space
    } else {
      contactArr = contact.split(" ");
    }

    const uuid = uuidv4();
    const emailPlaceholder = uuid;

    if (contactArr.length === 1) {
      lastname = contactArr[0].trim();
      firstname = "(empty)";
      email = emailPlaceholder;
    } else if (contactArr.length === 2) {
      lastname = contactArr[0].trim();
      firstname = contactArr[1].trim();
      email = emailPlaceholder;
    } else if (contactArr.length > 2) {
      lastname = contactArr[0].trim();
      firstname = contactArr[1].trim();
      email = contactArr[2].trim();

      if (!Validation.email(email)) {
        email = emailPlaceholder;
      }
    }

    // insert ignore
    // if ignore, select to get id
    // after insert, replace "[logged in user_id]-contact_id" with primary key
    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert({
        firstname,
        lastname,
        email,
        //user_id: ownerId,
        company_id: body.company_id,
        uuid: uuidv4(),
        owner_id: state.logged_in_user_id,
        created_by_id: state.logged_in_user_id,
        updated_by_id: state.logged_in_user_id,
      })
      .into("contacts")
      .then((ids) => {
        const id = ids[0];

        state.body.fields[field] = id;

        if (email.indexOf("(empty)") > -1) {
          return resolve(updateEmail(state, id));
        }

        return resolve(state);
      })
      .catch((err) => {
        // just in case we failed to update the empty email to a unique value
        if (
          err.message.indexOf("contacts_company_id_email_is_deleted_unique")
        ) {
          state.knex = knexInterface.connect(state.knex);
          state.knex
            .select("id")
            .from("contacts")
            .where({ email })
            .then((values) => {
              const id = values[0].id;

              state.body.fields[field] = id;

              return resolve(updateEmail(state, id));
            })
            .catch((err2) => {
              return reject(err2);
            });
        } else {
          return reject(err);
        }
      });
  }); // return Promise
}; // insertContactInner

const updateEmail = (state, id) => {
  return new Promise((resolve, reject) => {
    const email = `(empty)${id}`;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("contacts")
      .update({ email })
      .where({ id })
      .then(() => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}; // updateEmail

const insertComponent = (state, field) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const fields = body.fields;

    const liveComponent = fields.live_component;
    const postComponent = fields.post_component;

    const templateComponent = parseInt(fields.template_id);

    if (
      ((liveComponent && field === "live") ||
        (postComponent && field === "post")) &&
      templateComponent == 0
    ) {
      console.log("component, component");
      const component = _.find(Components, { field });

      Promise.mapSeries(component.categories, (category) => {
        // process each individual item here, return a promise
        return insertCategory(state, category);
      })
        .then(() => {
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    } else if (templateComponent > 0 && field === "template") {
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
        .where({ template_id: templateComponent, is_deleted: 0 })
        .then((values) => {
          if (values.length) {
            Promise.mapSeries(values, (category) => {
              // process each individual item here, return a promise
              return insertCategoryForTemplate(state, category);
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
    } else {
      return resolve(state);
    }
  });
}; // insertComponent

const insertCategoryForTemplate = (state, category) => {
  return new Promise((resolve, reject) => {
    const old_category_id = category.id;
    const project_id = state.project_id;
    const categoryObj = {
      name: category.name,
      code: category.code,
      project_id: project_id,
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
          .select("number", "days", "name")
          .from("items")
          .where({ is_deleted: 0, category_id: old_category_id })
          .then((items) => {
            if (items.length) {
              Promise.mapSeries(items, (item) => {
                // process each individual item here, return a promise
                return insertItemForTemplate(state, item, categoryId);
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
}; // insertCategoryForTemplate

const insertItemForTemplate = (state, item, categoryId) => {
  return new Promise((resolve, reject) => {
    const name = item.name;
    const number = item.number;
    const days = item.days;
    const project_id = state.project_id;
    const itemObj = {
      category_id: categoryId,
      project_id: project_id,
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
        const subitemObj = {
          item_id: itemId,
          created_by_id: state.logged_in_user_id,
          updated_by_id: state.logged_in_user_id,
        };
        state.knex = knexInterface.connect(state.knex);
        state.knex
          .insert(subitemObj)
          .into("subitems")
          .then(() => {
            return resolve(state);
          })
          .catch((err) => {
            return reject(err);
          }); //state.knex.insert(subitemObj)
      })
      .catch((err) => {
        return reject(err);
      }); //state.knex.insert(itemObj)
  });
}; // insertItemForTemplate

const insertCategory = (state, category) => {
  return new Promise((resolve, reject) => {
    const name = category.name;
    const code = category.code;
    const items = category.items;

    const categoryObj = {
      project_id: state.project_id,
      name,
      code,
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(categoryObj)
      .into("categories")
      .then((ids) => {
        const categoryId = ids[0];

        state.category_ids.push(categoryId);

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

    const itemObj = {
      category_id: categoryId,
      project_id: state.project_id,
      name,
      number,
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

        const subitemObj = {
          item_id: itemId,
          created_by_id: state.logged_in_user_id,
          updated_by_id: state.logged_in_user_id,
        };

        state.knex = knexInterface.connect(state.knex);
        state.knex
          .insert(subitemObj)
          .into("subitems")
          .then(() => {
            return resolve(state);
          })
          .catch((err) => {
            return reject(err);
          }); //state.knex.insert(subitemObj)
      })
      .catch((err) => {
        return reject(err);
      }); //state.knex.insert(itemObj)
  });
}; // insertItem

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

    initialState.errMsgs = [];

    initialState.category_ids = [];
    initialState.item_ids = [];

    insertClient(initialState)
      .then(insertContact)
      .then(insertLp)
      .then(insertPm)
      .then(insertProject)
      .then(insertLiveComponent)
      .then(insertPostComponent)
      .then(insertTemplateComponent)
      .then(insertUser)

      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        //console.log(state)
        state.response = state.uuid;
        return resolve(state);
      })
      .catch((err) => {
        console.log(err);

        // rollback project records
        const deleteProject = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("projects")
              .whereIn("id", [state.project_id])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err2) => {
                return reject(err2);
              });
          });
        }; // deleteProject

        const deleteUser = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("users_projects")
              .whereIn("project_id", [state.project_id])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err7) => {
                return reject(err7);
              });
          });
        }; // deleteProject

        const deleteCategories = (state) => {
          return new Promise((resolve, reject) => {
            state.knex = knexInterface.connect(state.knex);
            state
              .knex("categories")
              .whereIn("project_id", [state.project_id])
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
              .whereIn("category_id", [state.category_ids])
              .delete()
              .then(() => {
                return resolve(state);
              })
              .catch((err4) => {
                return reject(err4);
              });
          });
        }; // deleteItems

        const deleteSubitems = (state) => {
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
        }; // deleteSubitems

        deleteProject(initialState)
          .then(deleteCategories)
          .then(deleteItems)
          .then(deleteSubitems)
          .then(deleteUser)
          .then(() => {
            return reject(err);
          })
          .catch((err6) => {
            return reject(err6);
          });
      });
  }); // return Promise
};
