const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",   
  port: 3307,        
  user: "root",
  password: "password",
  database: "gateway",
  
});

module.exports = pool;