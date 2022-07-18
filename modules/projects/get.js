/*

URL: /projects/get/{project_id}
METHOD: get
INPUTS:
FUNCTIONS: get project
OUTPUT: project object

*/
const Moment = require("moment-timezone");
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getProject = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const path = event.params;

    const projectId = path.projectId;

    if (!projectId) {
      reject(Error("project id missing"));
    } else {
      // insert ignore
      // if ignore, select to get id
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
          "version",
          "default_hours_in_day",
          "default_fringe_pw_bp",
          "default_fringe_2_bp",
          "default_markup_bp",
          "default_insurance_bp",
          "event_date"
        )
        .from("projects")
        .where({ uuid: projectId, is_deleted: 0 })
        .then((values) => {
          if (values.length) {
            state.project = {
              fields: {},
              children: {},
            };

            const projectFields = values[0];

            const momentDate = new Moment(projectFields.event_date).utc();
            projectFields.event_date = momentDate.format("YYYY-MM-DD HH:mm:ss");

            state.project.fields = projectFields;

            return resolve(state);
          }

          return reject(Error("project not found"));
        })
        .catch((err) => {
          return reject(err);
        });
    }
  }); // return Promise
}; // getProject

const getClient = (state) => {
  return new Promise((resolve, reject) => {
    const clientId = state.project.fields.client_id;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select("id", "name", "address1", "address2", "city", "state", "zip")
      .from("companies")
      .where({ id: clientId, is_deleted: 0 })
      .then((values) => {
        if (values.length) {
          state.project.children.client = values[0];

          state.project.children.client.display = values[0].name;

          return resolve(state);
        }

        return reject(Error("client not found"));
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getClient

const getContact = (state) => {
  return new Promise((resolve) => {
    resolve(getContactInner(state, "contact"));
  }); // return Promise
}; // getContact

const getLp = (state) => {
  return new Promise((resolve) => {
    resolve(getContactInner(state, "lp"));
  }); // return Promise
}; // getLp

const getPm = (state) => {
  return new Promise((resolve) => {
    resolve(getContactInner(state, "pm"));
  }); // return Promise
}; // getPm

const getUsers = (state) => {
  return new Promise((resolve, reject) => {
    const projectId = state.project.fields.id;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select(
        "users.id",
        "firstname",
        "lastname",
        "users.email",
        "role_id",
        "users.uuid",
        "contacts.id as contact_id"
      )
      .from("users")
      .innerJoin("users_projects", "users_projects.user_id", "users.id")
      .innerJoin("contacts", "contacts.user_id", "users.id")
      .where({
        project_id: projectId,
        "users_projects.is_deleted": 0,
        "contacts.is_deleted": 0,
        "users.is_deleted": 0,
      })
      .then((values) => {
        state.project.children.users = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getUsers

/* ****
PROMISES END
*** */

/* ****
SHARED FUNCTIONS START
*** */

const getContactInner = (state, obj) => {
  return new Promise((resolve, reject) => {
    const field = `${obj}_id`;

    const id = state.project.fields[field];

    if (!id) {
      state.project.children[obj] = {};
      return resolve(state);
    }

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .select("id", "firstname", "lastname", "email", "phone")
      .from("contacts")
      .where({ id, is_deleted: 0 })
      .then((values) => {
        if (values.length) {
          state.project.children[obj] = values[0];

          return resolve(state);
        }

        return reject(Error(`${obj} not found`));
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // getContactInner

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

    getProject(initialState)
      .then(getClient)
      .then(getContact)
      .then(getLp)
      .then(getPm)
      .then(getUsers)

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
