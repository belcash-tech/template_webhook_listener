const path = require("path");
const Pool = require("pg").Pool;
const env = process.env.NODE_ENV || "development";
const config = {};
const pool = {};
if (env === "development") {
  config = require("dotenv").config({ path: path.resolve("config/.env") })
    .parsed;
  pool = new Pool({
    host: config.DBHOST,
    port: config.DBPORT,
    user: config.DBUSER,
    password: config.DBPASS,
    database: config.DB,
  });
} else {
  pool = new Pool({});
}

var _this = (module.exports = {
  saveReport: async function (
    log = { request: {}, body: {}, query: {}, summary: {} }
  ) {
    try {
      if (env === "development") {
        let query = `insert into request_log(request_log,request_query, request_body,summary)values('${log.request}','${log.query}','${log.body}', '${log.summary}') returning *;`;
        let result = await pool.query(query);
        return result.rows;
      } else {
        console.log(log);
      }
    } catch (error) {
      throw error;
    }
  },
  getReports: async function () {
    try {
      if (env === "development") {
        let query = `select * from request_log order by created_at desc`;
        let result = await pool.query(query);
        return result.rows;
      }
    } catch (error) {
      throw error;
    }
  },
});
