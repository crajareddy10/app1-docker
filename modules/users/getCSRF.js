/*

  URL: /users/getCSRF
  METHOD: get
  INPUTS: <none>
  OUTPUT: random string

  */

const hashing = require("../../utils/Hashing");

module.exports = (initialState) => {
  const csrf = hashing.random();

  //SET COOKIE
  var date = new Date();

  // Get Unix milliseconds at current time plus 365 days
  date.setTime(+date + 1 * 86400000); //24 \* 60 \* 60 \* 100

  const cookieName = process.env.CSRF_COOKIE;

  const domain = process.env.COOKIE_DOMAIN;

  //id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
  let cookie = `${cookieName}=${csrf}; expires=${date.toGMTString()}; domain=${domain}; path=/`;

  if (process.env.ENV === "prod") {
    cookie = `${cookie}; Secure`;
  }

  cookie = `${cookie}; HttpOnly;`;

  //cookie = "Test1=test_value1; expires=Sun, 13 Aug 2018 14:28:43 GMT; path=/;"

  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      "Set-Cookie": cookie,
    },
    body: csrf,
  };

  initialState.response = response;

  return initialState;
};
