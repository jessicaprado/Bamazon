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
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

var startShopping = function() {
    connection.query('SELECT * FROM bamazon.inventory', function(res) {
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Which product would you like to buy?",
			choices: function(res) { 
	            var itemsArray = [];
	            for (var i = 0; i < res.length; i++) {
	                var pleasework = itemsArray.push(("'" + res[i].itemID + " | " + res[i].ProductName + " | " + res[i].Price + "'"));
	            }  
                return pleasework;   
        	    console.log(pleasework);      
	        },
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

startShopping();