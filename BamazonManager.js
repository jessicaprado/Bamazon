var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host    : "localhost",
    port    : 3306,
    user    : "root", //Your username
    password: "Jmprado1289", //Your password
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) {
        console.error('DB Connection Failed');
        throw err;
    }
    console.log("connected as id " + connection.threadId)
})
