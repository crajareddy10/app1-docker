/*

URL: /users/create
METHOD: post
INPUTS: user
FUNCTIONS: create user
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");
const hashing = require("../../utils/Hashing");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const SES = require("aws-sdk/clients/ses");

/* ****
PROMISES START
*** */

const insertUser = (state) => {
  return new Promise((resolve, reject) => {
    const user = state.user;

    const hashingVal = state.hashing;

    user.hashed_password = hashingVal.hash;
    user.created_by_id = state.logged_in_user_id;
    user.updated_by_id = state.logged_in_user_id;
    state.user = user;

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(state.user)
      .into("users")
      .then((ids) => {
        const id = ids[0];

        state.user.id = id;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertUser

const sendEmail = (state) => {
  return new Promise((resolve, reject) => {
    const user = state.user;
    const transport = nodemailer.createTransport({
      SES: new SES({
        apiVersion: "2010-12-01",
      }),
    });

    const mailOptions = {
      from: "BidBuddy <mishra.deepak264@gmail.com>", // sender address
      to: user.email, // list of receivers
      subject: "BidBuddy sign up Confirmation", // Subject line
      html: `<b>Please <a href='${process.env.CLIENT_DOMAIN}/user/confirmation/${user.uuid}'>click here</a> to confirm your sign up.</b>`, // email body
    };

    transport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
        state.user.emailErr = error;
      } else {
        state.user.emailMsg = response;
        console.log("Message sent: " + response.message);
      }
      transport.close(); // shut down the connection pool, no more messages
      return resolve(state);
    });
  }); // return Promise
}; // sendEmail

const insertCompany = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const name = body.name;

    const company_id = body.company_id;

    const company_name = body.company_name;

    const userId = state.logged_in_user_id;

    if (parseInt(company_id) == 0 && company_name && company_name != "") {
      const company = {
        name: company_name,
        user_id: state.user.id,
        owner_id: userId,
        created_by_id: userId,
        updated_by_id: userId,
        uuid: uuidv4(),
        email: body.email || uuidv4(),
        address1: body.address1 || "",
        address2: body.address2 || "",
        city: body.city || "",
        state: body.state || "",
        zip: body.zip || "",
        phone: body.phone || "",
      };
      state.knex = knexInterface.connect(state.knex);
      state.knex
        .insert(company)
        .into("companies")
        .then((ids) => {
          const id = ids[0];
          state.user.company_id = id;
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // insertCompany

const insertContact = (state) => {
  return new Promise((resolve, reject) => {
    const body = state.body;

    const name = body.name;

    const spaceIdx = name.indexOf(" ");

    let firstname = "";

    let lastname = "";

    if (!spaceIdx) {
      firstname = name;
    } else {
      firstname = name.substring(0, spaceIdx);

      lastname = name.substring(spaceIdx + 1);
    }

    const userId = state.user.id;

    const contact = {
      user_id: userId,
      firstname,
      lastname,
      email: state.user.email,
      uuid: uuidv4(),
      company_id:
        body.company_id != 0
          ? body.company_id
          : state.user.company_id
          ? state.user.company_id
          : 0,
      title: body.title || "",
      address1: body.address1 || "",
      address2: body.address2 || "",
      city: body.city || "",
      state: body.state || "",
      zip: body.zip || "",
      phone: body.phone || "",
      created_by_id: state.logged_in_user_id,
      updated_by_id: state.logged_in_user_id,
      owner_id: state.logged_in_user_id,
    };

    state.knex = knexInterface.connect(state.knex);
    state.knex
      .insert(contact)
      .into("contacts")
      .then((id) => {
        contact.id = id;
        contact.name = name;
        state.user.contact = contact;

        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
}; // insertContact

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

    initialState.errMsgs = ["users_email_is_deleted_unique"];

    const body = initialState.body;

    if (!body.password) {
      body.password = hashing.random();
    }

    const uuid = uuidv4();

    let email = body.email;
    if (!email) {
      email = uuid;
    }

    initialState.user = {
      uuid,
      email,
    };

    initialState.user.password_salt = hashing.random();

    initialState.hashing = {};

    initialState.hashing.plain = `${body.password}${initialState.user.password_salt}`;

    hashing
      .hash(initialState) // hash password
      .then(insertUser)
      .then(sendEmail)
      // .then(insertCompany)
      .then(insertContact)

      /* ****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.user;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
