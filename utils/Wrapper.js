const releaseMemory = require("./ReleaseMemory");
const response = require("./Response");
const keepWarm = require("./KeepWarm");
const userId = require("./UserId");

module.exports = (req, res, module) => {
  req.context.callbackWaitsForEmptyEventLoop = false;

  if (!keepWarm.check(req, res)) {
    let initialState = {};

    try {
      if (process.env.ENV !== "dev") {
        /* CHECK ORIGIN */
        if (event.headers.origin !== process.env.origin) {
          throw new Error("origin_rejected");
        }
      }

      const body = req.body;
      const path = req.params;
      const context = req.context;

      initialState.event = req;
      initialState.body = body;
      initialState.context = context;
      initialState.path = path;

      userId(initialState)
        .then(module)
        .then((state) => {
          const resp = response.success(state.response);
          return res.send(resp);
        })

        /* ****
        HANDLER FOOTER START
        **** */

        .catch((err) => {
          if (process.env.ENV !== "prod") {
            console.log("ERROR:");
            console.log(err);
            console.log(":ERROR");
          }

          return res.send(response.error(err, initialState.errMsgs));
        })
        .then(() => {
          initialState = releaseMemory(initialState);
        });
    } catch (err) {
      initialState = releaseMemory(initialState);

      return res.send(response.error(err));
    }
  } // keepWarm
};
