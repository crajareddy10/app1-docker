/*

URL: /logs/{tableName}/create
METHOD: post
INPUTS: fields
FUNCTIONS: create logs
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const insertLog = (state) => {
  const event = state.event;
  const path = event.params;
  const tableName = path.tableName;
  if (tableName == "prs") {
    return insertPRSData(state);
  }
  if (tableName == "pos") {
    return insertPOSData(state);
  }
  if (tableName == "pcs") {
    return insertPCSData(state);
  }
  if (tableName == "ccs") {
    return insertCCSData(state);
  }
  if (tableName == "cos") {
    return insertCOSData(state);
  }
}; // createLog

const insertCOSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const number = body.fields.number;
    const name = body.fields.name;
    const note = body.fields.note;
    const co_date = body.fields.co_date;
    const project_id = body.project_id;
    const category_id = body.fields.category_id;
    const item_id = body.fields.item_id;
    const userId = state.logged_in_user_id;

    const log = {
      project_id,
      number,
      name,
      note,
      co_date,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(log)
      .into("cos")
      .then((id) => {
        log.id = id[0];
        state.log = log;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertChangeOrder

const insertPRSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const batch_num = body.fields.batch_num;
    const name = body.fields.name;
    const note = body.fields.note;
    const pr_date = body.fields.pr_date;
    const project_id = body.project_id;

    const userId = state.logged_in_user_id;

    const log = {
      project_id,
      batch_num,
      name,
      note,
      pr_date,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(log)
      .into("prs")
      .then((id) => {
        log.id = id[0];
        state.log = log;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertPayrollLog

const insertPCSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const vendor_id = body.fields.vendor_id;
    const env_num = body.fields.env_num;
    const name = body.fields.name;
    const amt_in_cents = body.fields.amt_in_cents;
    const pc_date = body.fields.pc_date;
    const project_id = body.project_id;

    const userId = state.logged_in_user_id;

    const log = {
      project_id,
      vendor_id,
      env_num,
      name,
      amt_in_cents,
      pc_date,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(log)
      .into("pcs")
      .then((id) => {
        log.id = id[0];
        state.log = log;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertPettyCashLog

const insertPOSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const po_num = body.fields.po_num;
    const number = body.fields.number;
    const po_date = body.fields.po_date;
    const vendor_id = body.fields.vendor_id;

    const project_id = body.project_id;
    const userId = state.logged_in_user_id;

    const log = {
      project_id,
      po_num,
      number,
      vendor_id,
      po_date,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(log)
      .into("pos")
      .then((id) => {
        log.id = id[0];
        state.log = log;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertPurchaseOrderLog

const insertCCSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const vendor_id = body.fields.vendor_id;
    const name = body.fields.name;
    const amt_in_cents = body.fields.amt_in_cents;
    const cc_date = body.fields.cc_date;
    const last4 = body.fields.last4;

    const project_id = body.project_id;
    const userId = state.logged_in_user_id;

    const log = {
      project_id,
      vendor_id,
      name,
      amt_in_cents,
      cc_date,
      last4,
      created_by_id: userId,
      updated_by_id: userId,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(log)
      .into("ccs")
      .then((id) => {
        log.id = id[0];
        state.log = log;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertCreditCardLog

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

    insertLog(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.log;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
