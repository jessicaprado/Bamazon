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

var lowInventory = function() {
    var almostSoldOut = []
    connection.query('SELECT * FROM bamazon.inventory WHERE StockQuantity <= 5', function(err, res) {
        var lowItems = [];
        for (var i = 0; i < res.length; i++) {
            lowItems.push([res[i].itemID, res[i].ProductName, res[i].Price, res[i].StockQuantity]);
        }
        almostSoldOut.push(lowItems);
        for (var i = 0; i < almostSoldOut.length; i++) {
            console.table(['ID', 'Name', 'Price', 'Stock'], almostSoldOut[i])
        }
    })
}

var addInventory = function() {
    displayInventory()
    connection.query('SELECT * FROM bamazon.inventory', function(err, res) {
         inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Which product would you like to add more of?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return "Please enter a valid number";
                }
            }
            
        }, {
            name: "quantity",
            type: "input",
            message: "How many units would you like to add?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return "Please enter a valid number";
                }
            }
        }]).then(function(answers) {
            var selectedItemArray = ((answers.item) - 1);
            var correctStock = (res[selectedItemArray].StockQuantity);
            var finalCount = ((correctStock) + (parseInt(answers.quantity)));
            connection.query("UPDATE bamazon.inventory SET ? WHERE ?", [{StockQuantity: finalCount}, {itemID: parseInt(answers.item)}], function(res) {
                console.log("Inventory has been updated to " + finalCount + "!");
            })
        })
    })
}

var newProduct = function(){
    connection.query('SELECT * FROM bamazon.inventory', function(err, res) {
         inquirer.prompt([{
            name: "name",
            type: "input",
            message: "What is the product name?",
        }, {
            name: "department",
            type: "input",
            message: "What department does it belong to?",
        }, {
            name: "price",
            type: "input",
            message: "What is the price you want to sell it for?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return "Please enter a valid number";
                }
            }
        }, {
            name: "quantity",
            type: "input",
            message: "How many do you have in stock?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return "Please enter a valid number";
                }
            }
        }

        ]).then(function(answers) {
            connection.query('INSERT INTO bamazon.inventory(ProductName, DepartmentName, Price, StockQuantity) VALUES ("' 
            + answers.name + '", "' + answers.department + '", ' + (parseInt(answers.price)) + ', ' + (parseInt(answers.quantity)) + ')');
            console.log("Item added!");
        })
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

            case 'View Low Inventory':
                lowInventory();
            break;

            case 'Add to Inventory':
                addInventory();
            break;

            case 'Add New Product':
                newProduct();
            break;
          }
        });
    })
}

start();