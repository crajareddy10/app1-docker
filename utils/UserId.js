const knexInterface = require("./KnexInterface");
const principalId = require("./PrincipalId");

const getUserId = (state) => {
  return new Promise((resolve, reject) => {
    const sessionKey = principalId(state.event, state.context);

    if (sessionKey) {
      const now = Date.now();

      const ms = parseInt(process.env.TOKEN_DURATION_SECONDS, 10) * 1000;

      const expires = now + ms;

      state.knex = knexInterface.connect(state.knex);
      state.knex
        .select("user_id")
        .from("users_sessions")
        .where({ session_key: sessionKey })
        .andWhere("session_ms", "<", expires)
        .limit(1)
        .then((values) => {
          if (values.length) {
            const value = values[0];

            state.logged_in_user_id = value.user_id;

            return resolve(state);
          }

          reject(Error("invalid session"));
        })
        .catch((err) => {
          return reject(err);
        });
    } else {
      return resolve(state);
    }
  }); // return Promise
}; // getSettings

module.exports = (initialState) => {
  return new Promise((resolve, reject) => {
    getUserId(initialState)
      .then((state) => {
        return resolve(state);
      })
      .catch((err) => {
        return reject(err);
      });
  }); // return Promise
};
