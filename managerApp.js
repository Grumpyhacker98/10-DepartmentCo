
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
    actionQuery()
});

function actionQuery() {
    inquirer.prompt([
        {
            name: "this",
            type: "list",
            message: "What would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }
    ]).then(function (awnser) {
        switch (awnser.this) {
            case ("View Products for Sale"):
                viewInventory()
                break;
            case ("View Low Inventory"):
                lowInventory()
                break;
            case ("Add to Inventory"):
                addInventory()
                break;
            case ("Add New Product"):
                addProduct()
                break;
            case ("EXIT"):
                connection.end()
                break;
        }
    });
}

// list every available item: the item IDs, names, prices, and quantities.
function viewInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for(var i = 0;i<res.length;i++){
            console.log("ID: "+res[i].item_ID+" Name: "+res[i].product_name+" Price: "+res[i].price+" Quantity: "+res[i].stock_quantity)
        }
        connection.end()
    })
}
// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log("The following products have a quantity of 5 or lower")
        for(var i = 0;i<res.length;i++){
            console.log("ID: "+res[i].item_ID+" Name: "+res[i].product_name+" Price: "+res[i].price+" Quantity: "+res[i].stock_quantity)
        }
        connection.end()
    })
}
// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {

}
// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function addProduct() {

}