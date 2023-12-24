const mysql = require('mysql2');

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database: 'test_db'
})

mysqlConnection.connect((err) => {
    if(err){
        console.log("Eroor in DB connection"+JSON.stringify(err,undefined,2));
    }else{
        console.log("Db connection successful.")
    }
})
module.exports = mysqlConnection;