
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
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_ID + " Name: " + res[i].product_name + " Price: " + res[i].price + " Quantity: " + res[i].stock_quantity)
        }
        connection.end()
    })
}
// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log("The following products have a quantity of 5 or lower")
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_ID + " Name: " + res[i].product_name + " Price: " + res[i].price + " Quantity: " + res[i].stock_quantity)
        }
        connection.end()
    })
}
//display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].item_ID);
                    }
                    return choiceArray;
                },
                message: "What products stock do you need to update",
                name: "id"
            },
            {
                type: "input",
                message: "How many units need to be added?",
                name: "quantity"
            },
        ]).then(function (add) {
            console.log(add.id)
            console.log(add.quantity)
            newStock = res[add.id - 1].stock_quantity + add.quantity
            connection.query("UPDATE products SET ? WHERE ?",
                [{ stock_quantity: newStock }, { item_ID: add.id }],
                function (error) {
                    if (error) throw err;
                    console.log("Placed order successfully!");
                    connection.end()
                }
            );
        });
    })
}
// add a completely new product to the store.
function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new product?"
        },
        {
            name: "department",
            type: "input",
            message: "what department does it belong in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much does it cost?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many does the store have?"
        },
    ]).then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function (err) {
                if (err) throw err;
                console.log("Succesfully added product");
                connection.end()
            }
        );
    });
}