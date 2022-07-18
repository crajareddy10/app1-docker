/*

URL: /projects/{project_type}
METHOD: get
INPUTS:
FUNCTIONS: get project
OUTPUT: project object

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getProjects = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const projectType = path.projectType;

    const userId = state.logged_in_user_id;

    const query = event.query;

    if (!projectType) {
      reject(Error("project type missing"));
    } else {
      let phase_id = [0, 1];
      if (projectType == "archived") {
        phase_id = [2, 3, 4, 5];
      }
      if (projectType == "all") {
        phase_id = [0, 1, 2, 3, 4, 5];
      }
      // insert ignore
      // if ignore, select to get id
      state.knex = knexInterface.connect(state.knex);
      const q = state.knex
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
          "version",
          "default_rate_type_id",
          "default_hours_in_day",
          "default_fringe_pw_bp",
          "default_fringe_2_bp",
          "default_markup_bp",
          "default_insurance_bp",
          "event_date",
          "uuid"
        )
        .from("projects")
        .where({ is_deleted: 0, owner_id: userId })
        .whereIn("phase_id", phase_id)
        .orderBy("updated_at", "desc");
      if (query.searchterm) {
        q.whereRaw(
          `(name like '%${query.searchterm}%' or version like '%${query.searchterm}%' or number like '%${query.searchterm}%' or event_date like '%${query.searchterm}%')`
        );
      }
      q.then((values) => {
        state.project = {
          fields: {},
        };

        if (values.length) {
          const projectFields = values;

          state.project.fields = projectFields;

          return resolve(state);
        }
        state.project.fields = {};
        return resolve(state);
      }).catch((err) => {
        return reject(err);
      });
    }
  }); // return Promise
}; // getProject

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

    getProjects(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.project;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
