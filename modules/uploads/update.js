/*

URL: /files/upload
METHOD: put
INPUTS: file
FUNCTIONS: upload
OUTPUT: success

*/
const knexInterface = require("../../utils/KnexInterface");
const Promise = require("bluebird");
const S3 = require("aws-sdk/clients/s3");
const { v4: uuidv4 } = require("uuid");
//const s3 = new S3();
/* ****
PROMISES START
*** */

// const uploadFile = (buffer, name, type) => {
//   const params = {
//     ACL: 'public-read',
//     Bucket: process.env.S3_BUCKET,
//     ContentType: type.mime,
//     Key: `${name}.${type.ext}`
//   };
//   return s3.upload(params).promise();
// };

const createPresignedPost = (state) => {
  return new Promise((resolve, reject) => {
    const event = state.event;

    const body = event.body;

    const name = body.name;

    const type = body.type;

    const key = `${uuidv4()}_${name}`;

    const s3 = new S3();
    const params = {
      Expires: 3000,
      Bucket: process.env.S3_BUCKET,
      Conditions: [["content-length-range", 100, 10000000]], // 100Byte - 10MB
      Fields: {
        "Content-Type": type,
        key,
      },
    };

    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      state.presignedPostData = data;
      return resolve(state);
    });
  }); // return Promise
}; // createPresignedPost

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

    createPresignedPost(initialState)
      /*****
      MODULE FOOTER START
      **** */
      .then((state) => {
        state.response = state.presignedPostData;
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      }); // catch
  }); // return Promise
};
