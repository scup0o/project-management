const mysql = require("mysql"); 
const database = 'projectmanager';
  
let db_con  = mysql.createConnection({ 
    host: "localhost", 
    user: "root", 
    password: '123456789', 
    //database: database
}); 
  
connect();

async function connect() {
    try{
    db_con.query(`CREATE DATABASE IF NOT EXISTS ${database}`, function (err, result) {
      if (err) throw err;
      else console.log("Database connected");
    });
    db_con  = mysql.createConnection({ 
        host: "localhost", 
        user: "root", 
        password: '123456789', 
        database: database
    }); }
    catch (err){
      throw (err);
    }
    //addTable();
  }

async function addTable(){
    //user
    db_con.query(`SHOW TABLES FROM ${database} LIKE 'user'`,function(e, result){
        console.log(result);
        //chua tao
        if(result.length==0){
            db_con.query(`CREATE TABLE user (name VARCHAR(255), address VARCHAR(255))`, function(e, result){
                if (e) console.log(e);
                else console.log("created")
            })
        }
        //da ton tai
        else{
            
        }
    });
};
  
module.exports = db_con;
