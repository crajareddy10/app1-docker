/*

URL: /logs/update/{tableName}/{logId}
METHOD: post
INPUTS: log fields
FUNCTIONS: update log
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");

/* ****
PROMISES START
*** */

const updateLog = (state) => {
  const event = state.event;
  const path = event.params;
  const tableName = path.tableName;

  if (tableName == "prs") {
    return updatePRSData(state);
  }
  if (tableName == "pos") {
    return updatePOSData(state);
  }
  if (tableName == "pcs") {
    return updatePCSData(state);
  }
  if (tableName == "ccs") {
    return updateCCSData(state);
  }
  if (tableName == "cos") {
    return updateCOSData(state)
      .then(addCategory)
      .then(addItem)
      .then(getItems)
      .then(addSubItem);
  }
}; // updateLog

const updatePRSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const logId = body.id;

    delete body.id;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    if (body.pr_date && body.pr_date.includes("Z")) {
      delete body.pr_date;
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("prs")
      .update(body)
      .where({
        id: logId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Payroll not updated."));
        }
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateLog

const updateCOSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const logId = body.id;

    delete body.id;

    const currentApproval = body.currentApproval;

    delete body.currentApproval;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    if (body.co_date && body.co_date.includes("Z")) {
      delete body.co_date;
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("cos")
      .update(body)
      .where({
        id: logId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("ChangeOrder not updated."));
        }
        body.currentApproval = currentApproval;
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateLog

const updatePCSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    delete body.id;

    delete body.display;

    delete body.firstname;

    delete body.lastname;

    delete body.email;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    if (body.pc_date && body.pc_date.includes("Z")) {
      delete body.pc_date;
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("pcs")
      .update(body)
      .where({
        id: logId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Petty Cash not updated."));
        }
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateLog

const updatePOSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    delete body.id;

    delete body.display;

    delete body.firstname;

    delete body.lastname;

    delete body.email;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    if (body.po_date && body.po_date.includes("Z")) {
      delete body.po_date;
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("pos")
      .update(body)
      .where({
        id: logId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Purchase Order not updated."));
        }
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateLog

const updateCCSData = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    delete body.id;

    delete body.display;

    delete body.firstname;

    delete body.lastname;

    delete body.email;

    const userId = state.logged_in_user_id;

    body.updated_by_id = userId;

    if (body.cc_date && body.cc_date.includes("Z")) {
      delete body.cc_date;
    }

    state.knex = knexInterface.connect(state.knex);
    state
      .knex("ccs")
      .update(body)
      .where({
        id: logId,
      })
      .then((result) => {
        if (!result) {
          return reject(Error("Credit Card not updated."));
        }
        state.response = "success";
        return resolve(state);
      }) // then update
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // updateLog

const addCategory = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    const categoryId = body.category_id;

    if (categoryId) {
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert({
          category_id: categoryId,
          log_id: logId,
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

const addItem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    const itemId = body.item_id;
    if (itemId) {
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert({
          item_id: itemId,
          log_id: logId,
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

const getItems = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    const is_approved = body.is_approved;

    const currentApproval = body.currentApproval;

    if (is_approved != currentApproval && is_approved == 1) {
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select("items.id", "items.number")
        .from("items")
        .innerJoin("items_cos", "items_cos.item_id", "items.id")
        .where({
          "items_cos.log_id": logId,
          "items.is_deleted": 0,
        })
        .then((results) => {
          state.items = results;
          return resolve(state);
        }) // then update
        .catch((err) => {
          return reject(err);
        });
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // getItems

const addSubItem = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const path = event.params;

    const logId = path.logId;

    const is_approved = body.is_approved;

    const currentApproval = body.currentApproval;

    const items = state.items;

    if (is_approved != currentApproval && items.length > 0) {
      let subitems = [];
      items.forEach((i) => {
        subitems.push({
          item_id: i.id,
          name: i.number,
          log_id: logId,
          created_by_id: state.logged_in_user_id,
          updated_by_id: state.logged_in_user_id,
        });
      });
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert(subitems)
        .into("subitems")
        .then((result) => {
          const LogSubItemId = result[0];
          state.log_subitem_id = LogSubItemId;
          state.response = "changeorder_subitem_inserted";
          return resolve(state);
        }) // then update
        .catch((err) => {
          return reject(err);
        });
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // addSubitemItem

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

    updateLog(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      }); // catch
  }); // return Promise
};
