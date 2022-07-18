/*

URL: /logs/table/get
METHOD: get
INPUTS: project_id
FUNCTIONS: get logs
OUTPUT: array of log objects

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const getLogs = (state) => {
  const event = state.event;
  const path = event.params;
  const uuid = path.projectId;
  const tableName = path.tableName;

  if (tableName == "prs") {
    return getPRSData(state, uuid);
  }
  if (tableName == "pos") {
    return getPOSData(state, uuid);
  }
  if (tableName == "pcs") {
    return getPCSData(state, uuid);
  }
  if (tableName == "ccs") {
    return getCCSData(state, uuid);
  }
  if (tableName == "cos") {
    return getCOSData(state, uuid);
  }
}; // getLog

/* ****
PROMISES END
*** */

/* ****
SHARED FUNCTIONS START
*** */

const getPRSData = (state, uuid) => {
  const event = state.event;
  const path = event.params;
  return new Promise((resolve, reject) => {
    // if ignore, select to get id
    state.knex = knexInterface.connect(state.knex);
    const query = state.knex
      .select("prs.id", "prs.batch_num", "prs.name", "prs.note", "prs.pr_date")
      .from("prs")
      .innerJoin("projects", "prs.project_id", "projects.id")
      .where({
        "projects.uuid": uuid,
        "prs.is_deleted": 0,
        "projects.is_deleted": 0,
      });

    if (path.search) {
      query.whereRaw(
        `(prs.name like '%${path.search}%' or prs.batch_num like '%${path.search}%')`
      );
    }
    query
      .then((values) => {
        state.logs = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
const getPOSData = (state, uuid) => {
  const event = state.event;
  const path = event.params;
  return new Promise((resolve, reject) => {
    // if ignore, select to get id
    state.knex = knexInterface.connect(state.knex);
    const query = state.knex
      .select(
        "pos.id",
        "pos.po_num",
        "pos.number",
        "pos.po_date",
        "pos.vendor_id",
        "contacts.firstname",
        "contacts.lastname",
        "contacts.email"
      )
      .from("pos")
      .innerJoin("projects", "pos.project_id", "projects.id")
      .leftJoin("contacts", "contacts.id", "pos.vendor_id")
      .where({
        "projects.uuid": uuid,
        "contacts.is_deleted": 0,
        "pos.is_deleted": 0,
        "projects.is_deleted": 0,
      });
    if (path.search) {
      query.whereRaw(
        `(pos.number like '%${path.search}%' or pos.po_num like '%${path.search}%' or contacts.firstname like '%${path.search}%' or contacts.lastname like '%${path.search}%' or contacts.email like '%${path.search}%')`
      );
    }
    query
      .then((values) => {
        state.logs = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
const getPCSData = (state, uuid) => {
  const event = state.event;
  const path = event.params;
  return new Promise((resolve, reject) => {
    // if ignore, select to get id
    state.knex = knexInterface.connect(state.knex);
    const query = state.knex
      .select(
        "pcs.id",
        "pcs.vendor_id",
        "pcs.env_num",
        "pcs.name",
        "pcs.amt_in_cents",
        "pcs.pc_date",
        "pcs.is_returned",
        "contacts.firstname",
        "contacts.lastname",
        "contacts.email"
      )
      .from("pcs")
      .innerJoin("projects", "pcs.project_id", "projects.id")
      .leftJoin("contacts", "pcs.vendor_id", "contacts.id")
      .where({
        "projects.uuid": uuid,
        "pcs.is_deleted": 0,
        "projects.is_deleted": 0,
      });
    if (path.search) {
      query.whereRaw(
        `(pcs.name like '%${path.search}%' or pcs.env_num like '%${path.search}%' or contacts.firstname like '%${path.search}%' or contacts.lastname like '%${path.search}%' or contacts.email like '%${path.search}%')`
      );
    }
    query
      .then((values) => {
        state.logs = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
const getCCSData = (state, uuid) => {
  const event = state.event;
  const path = event.params;
  return new Promise((resolve, reject) => {
    // if ignore, select to get id
    state.knex = knexInterface.connect(state.knex);
    const query = state.knex
      .select(
        "ccs.id",
        "ccs.name",
        "ccs.amt_in_cents",
        "ccs.cc_date",
        "ccs.last4",
        "ccs.vendor_id",
        "contacts.firstname",
        "contacts.lastname",
        "contacts.email"
      )
      .from("ccs")
      .innerJoin("projects", "ccs.project_id", "projects.id")
      .leftJoin("contacts", "ccs.vendor_id", "contacts.id")
      .where({
        "projects.uuid": uuid,
        "ccs.is_deleted": 0,
        "projects.is_deleted": 0,
      });
    if (path.search) {
      query.whereRaw(
        `(ccs.name like '%${path.search}%' or ccs.last4 like '%${path.search}%' or ccs.amt_in_cents like '%${path.search}%' or contacts.firstname like '%${path.search}%' or contacts.lastname like '%${path.search}%' or contacts.email like '%${path.search}%')`
      );
    }
    query
      .then((values) => {
        state.logs = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
const getCOSData = (state, uuid) => {
  const event = state.event;
  const path = event.params;
  return new Promise((resolve, reject) => {
    // if ignore, select to get id
    state.knex = knexInterface.connect(state.knex);
    const query = state.knex
      .select(
        "cos.id",
        "cos.number",
        "cos.name",
        "cos.note",
        "cos.co_date",
        "cos.is_approved"
      )
      .from("cos")
      .innerJoin("projects", "cos.project_id", "projects.id")
      .where({
        "projects.uuid": uuid,
        "cos.is_deleted": 0,
        "projects.is_deleted": 0,
      });
    if (path.search) {
      query.whereRaw(
        `(cos.name like '%${path.search}%' or cos.number like '%${path.search}%' or cos.note like '%${path.search}%')`
      );
    }
    query
      .then((values) => {
        state.logs = values;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

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

    getLogs(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.logs;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
