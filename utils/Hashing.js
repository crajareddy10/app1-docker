const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const genHash = (state) => {
  return new Promise((resolve, reject) => {
    const salted = `${state.hashing.plain}${process.env.HASHING_SALT}`;
    const rounds = parseInt(process.env.SALT_ROUNDS, 10);

    bcrypt.hash(salted, rounds, (err, hash) => {
      if (err) {
        return reject(err);
      }

      state.hashing.hash = hash;

      return resolve(state);
    });
  }); // return Promise
}; // genSalt

const doCompare = (state) => {
  return new Promise((resolve, reject) => {
    const salted = `${state.hashing.plain}${process.env.HASHING_SALT}`;

    bcrypt.compare(salted, state.hashing.hash, (err, res) => {
      if (err) {
        return reject(err);
      } else if (!res) {
        return reject(Error("hash_does_not_match"));
      } else {
        state.hashing.result = true;

        return resolve(state);
      }
    });
  }); // return Promise
}; // doCompare

module.exports = {
  hash(initialState) {
    return new Promise((resolve, reject) => {
      genHash(initialState)
        .then((state) => {
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }); // return Promise
  },

  compare(initialState) {
    return new Promise((resolve, reject) => {
      doCompare(initialState)
        .then((state) => {
          return resolve(state);
        })
        .catch((err) => {
          return reject(err);
        });
    }); // return Promise
  },

  random(size) {
    if (!size) {
      size = 64;
    }

    return crypto.randomBytes(size).toString("hex");
  },
};
