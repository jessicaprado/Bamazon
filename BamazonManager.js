var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require('console.table');

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

var displayInventory = function () {
    var inventory = [];
    connection.query('SELECT * FROM bamazon.inventory', function(err, res) {
        var itemsArray = [];
        for (var i = 0; i < res.length; i++) {
            itemsArray.push([res[i].itemID, res[i].ProductName, res[i].Price, res[i].StockQuantity]);
        }
        inventory.push(itemsArray);
        for (var i = 0; i < inventory.length; i++) {
            console.table(['ID', 'Name', 'Price', 'Stock'], inventory[i])
        }
    })
}

var start = function() {
    connection.query('SELECT * FROM bamazon.inventory', function(res) {
        inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
              'View Products for Sale',
              'View Low Inventory',
              'Add to Inventory',
              'Add New Product'
            ]
          },
        ]).then(function (answers) {
          switch(answers.action) {
            case 'View Products for Sale':
                displayInventory();
            break;
          }
        });
    })
}

start();