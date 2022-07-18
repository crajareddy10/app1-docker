module.exports = {
  client: "mysql2",
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.MYSQLDB_DOCKER_PORT,
    // timezone: "UTC",
  },
  pool: { min: 0, max: 5 },
};
