module.exports = {
  success(response) {
    return response;
  },

  error(err, errMsgs) {
    let niceMsg = err.message;

    /*if (process.env.ENV !== 'prod') {

      niceMsg = err.message

    } else */

    if (errMsgs) {
      for (let i = 0; i < errMsgs.length; i++) {
        if (err.message.indexOf(errMsgs[i]) !== -1) {
          niceMsg = errMsgs[i];
          break;
        }
      }
    }

    const newErr = new Error(`[500] ${niceMsg}`);

    if (process.env.ENV === "prod") {
      newErr.stack = "";
    }

    return newErr;
  },

  unauthorized(err) {
    let niceMsg = "Unauthorized";

    if (process.env.ENV !== "prod") {
      niceMsg = err.message;
    }

    return niceMsg;
  },
};
