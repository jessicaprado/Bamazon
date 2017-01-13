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
	  		name: "quantity",
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
	  		connection.query("SELECT * FROM bamazon.inventory WHERE ?", {itemID: parseInt(answers.item)}, function(err, res){
	  			var stockLeft = ((res[0].StockQuantity) - (answers.quantity))
	  			console.log(stockLeft);
	  			if  (stockLeft > 0){ 
	  				console.log("Added to cart");
	  				connection.query("UPDATE bamazon.inventory SET ? WHERE ?", [{StockQuantity: parseInt(stockLeft)}, {itemID: parseInt(answers.item)}])
	  				console.log("Your total is " + (answers.quantity) * (res[0].Price))
	  			} else {
	  				console.log("We don't have enough of that!")
	  			}
	  		})
  			
		})
	})
};

displayInventory();
startShopping();








