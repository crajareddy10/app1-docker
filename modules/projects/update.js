/*

URL: /projects/update
METHOD: post
INPUTS: project fields
FUNCTIONS: update project
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateProject = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const phase_id = body.phase_id;

    delete body.id;

    const path = event.params;

    const projectId = path.projectId;

    const userId = state.logged_in_user_id;

    state.currentPhaseId = body.currentPhaseId;

    delete body.currentPhaseId;

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("projects")
      .update(body)
      .innerJoin("users_projects", "projects.id", "users_projects.project_id")
      .where({
        "projects.id": projectId,
        "projects.is_deleted": 0,
        "users_projects.is_deleted": 0,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Project not updated."));
        }

        state.response = "success";

        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateProject

const getSubItems = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const phaseid = body.phase_id;

    const current_phase_id = state.currentPhaseId;

    if (current_phase_id == phaseid || phaseid > 1) {
      return resolve(state);
    }

    const project_id = state.event.params.projectId;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select(
        "subitems.original_id",
        "subitems.item_id",
        "subitems.vendor_id",
        "subitems.is_paid",
        "subitems.how_paid",
        "subitems.terms",
        "subitems.partial_payment",
        "subitems.type_id",
        "subitems.log_id",
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
        "subitems.non_taxable_in_cents"
      )
      .from("subitems")
      .innerJoin("items", "subitems.item_id", "items.id")
      .innerJoin("projects", "items.project_id", "projects.id")
      .where({
        "projects.id": project_id,
        "items.is_deleted": 0,
        "projects.is_deleted": 0,
        "subitems.is_deleted": 0,
        "subitems.phase_id": current_phase_id,
      })
      .then((values) => {
        state.subitems = values;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

const insertSubitem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const phaseid = body.phase_id;

    const current_phase_id = state.currentPhaseId;

    if (current_phase_id == phaseid || phaseid > 1) {
      return resolve(state);
    }
    if (!state.subitems) {
      return resolve(state);
    }

    state.subitems.forEach((sitem) => {
      sitem["phase_id"] = phaseid;
      sitem["type_id"] = 1; //Running
    });

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(state.subitems)
      .into("subitems")
      .then(() => {
        state.inserted = true;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertSubitems
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

    updateProject(initialState)
      /*****
      MODULE FOOTER START
      **** */
      // .then(getSubItems)
      // .then(insertSubitem)
      .then((state) => {
        if (state.inserted) {
          state.response = "subitem_inserted";
        } else {
          state.response = "success";
        }
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      }); // catch
  }); // return Promise
};
