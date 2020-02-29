
var mysql = require("mysql");

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "amazonDB"
});

connection.connect(function (err, res) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    productQuery()
});

function productQuery() {
    inquirer.prompt([
        {
            name: "this",
            type: "list",
            message: "What would you like to do today??",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }
    ]).then(function (awnser) {
        switch (awnser.this) {
            case ("View Products for Sale"):

                break;
            case ("View Low Inventory"):

                break;
            case ("Add to Inventory"):

                break;
            case ("Add New Product"):

                break;
            case ("EXIT"):

                break;
        }
    });
}

// * Create a new Node application called `bamazonManager.js`. Running this application will:

// * List a set of menu options:

//   * View Products for Sale

//   * View Low Inventory

//   * Add to Inventory

//   * Add New Product

// * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
