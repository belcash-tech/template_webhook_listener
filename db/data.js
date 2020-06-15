const path = require('path')
const Pool=require('pg').Pool
const config = require('dotenv').config({path: path.resolve('config/.env')}).parsed
const pool = new Pool({
 host: config.DBHOST,
 port: config.DBPORT,
 user: config.DBUSER,
 password: config.DBPASS,
 database: config.DB
})
var _this = module.exports = {
   saveReport: async function(log={ request: {},  body: {} , query: {} }) {
      try{
        let query=`insert into request_log(request_log,request_query, request_body)values('${log.request}','${log.query}','${log.body}') returning *;`
	let result = await pool.query(query);
	return result.rows;
      }catch(error){
        throw error
      }
  },
  getReports: async function() {
    try{
     let query=`select * from request_log order by created_at desc`;
     let result = await pool.query(query);
     return result.rows 
    }catch(error) { throw error }
  }

}
