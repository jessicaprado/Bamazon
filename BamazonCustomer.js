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
	        itemsArray.push([res[i].itemID, res[i].ProductName, res[i].Price]);
	 	}
	 	inventory.push(itemsArray);
	 	for (var i = 0; i < inventory.length; i++) {
	 		console.table(['ID', 'Name', 'Price'], inventory[i])
	 	}
	})
}

var startShopping = function() {
    connection.query('SELECT * FROM bamazon.inventory', function(res) {
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Which product would you like to buy?",
            validate: function(value) {
		        if (isNaN(value) == false) {
		            return true;
		        } else {
		            return "Please enter a valid number";
		        }
	  		}
	  		
	  	}, {
	  		name: "StockQuanity",
	  		type: "input",
	  		message: "How many units would you like to buy?",
            validate: function(value) {
		        if (isNaN(value) == false) {
		            return true;
		        } else {
		            return "Please enter a valid number";
		        }
	  		}
	  	}]).then(function (answers) {
  			console.log(JSON.stringify(answers, null, '  '));
			})
	})
};

displayInventory();
startShopping();








