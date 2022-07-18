/*

URL: /auth
INPUTS: Auth token
FUNCTIONS: Authenticates user
OUTPUT: allow, deny, unauthorized

*/

const hashing = require("../utils/Hashing");
const releaseMemory = require("../utils/ReleaseMemory");
const keepWarm = require("../utils/KeepWarm");

/* ****
HELPER FUNCTIONS START
*** */
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};

  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

/* ****
HELPER FUNCTIONS END
*** */

/* ****
HANDLER START
*** */

module.exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!keepWarm.check(event, callback)) {
    try {
      let token = event.authorizationToken;

      if (!token) {
        throw new Error("token_missing");
      }

      token = token.replace("Bearer ", "");
      token = token.replace(/"/g, "");

      const tokenArr = token.split("|");

      if (tokenArr.length === 3) {
        const sessionKey = tokenArr[0];

        const sessionTime = parseInt(tokenArr[1], 10);

        const sessionHash = tokenArr[2];

        const now = Date.now();

        const ms = parseInt(process.env.TOKEN_DURATION_SECONDS, 10) * 1000;

        const expires = sessionTime + ms;

        if (expires < now) {
          throw new Error("token_expired");
        }

        let initialState = {
          sessionKey,
          hashing: {
            plain: `${sessionKey}${sessionTime}`,
            hash: sessionHash,
          },
        };

        hashing
          .compare(initialState) // compare token parts

          .then((state) => {
            console.log(state.sessionKey);

            callback(null, generatePolicy(state.sessionKey, "Allow", "*")); // sessionKey
          })
          .catch((err) => {
            callback(null, generatePolicy(err.message, "Deny", "*"));
          })
          .then(() => {
            initialState = releaseMemory(initialState);
          });
      } else {
        throw new Error("auth_invalid_token");
      }
    } catch (err) {
      if (process.env.ENV !== "prod") {
        console.log("AUTH ERROR");
        console.log("** event");
        console.log(event);
        console.log(err.message);
      }

      callback(null, generatePolicy(err.message, "Deny", "*"));
    }
  } // keepWarm
};
