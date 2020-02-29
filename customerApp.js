
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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for(var i = 0;i<res.length;i++){
            console.log("ID: "+res[i].item_ID+" Name: "+res[i].product_name+" Price: "+res[i].price+" Quantity: "+res[i].stock_quantity)
        }
        
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
                message: "What product would you like to buy",
                name: "id"
            },
            {
                type: "input",
                message: "How much would you like to purchase",
                name: "quantity"
            },
        ]).then(function (purchase) {
            correction = purchase.id - 1

            if (res[correction].stock_quantity < purchase.quantity) {
                console.log("not enough in stock")
                connection.end()
                return false
            }

            newPrice = purchase.quantity * res[correction].price
            newMessage = "This will cost $" + newPrice + ", Please confirm the purchase"
            inquirer.prompt([
                {   
                    name: "this",
                    type: "confirm",
                    message: newMessage,
                }
            ]).then(function (awnser) {
                if (awnser.this) {

                    newStock = res[correction].stock_quantity - purchase.quantity
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{ stock_quantity: newStock }, { item_ID: purchase.id }],
                        function (error) {
                            if (error) throw err;
                            console.log("Placed order successfully!");
                            connection.end()
                        }
                    );
                }else{
                    connection.end()
                }
            });
        });
    });
}