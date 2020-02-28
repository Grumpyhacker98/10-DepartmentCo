
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
        console.log(res);
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
        ]).then(function (data) {
            correction = data.id - 1
            if(res[correction].stock_quantity<data.quantity){
                console.log("not enough in stock")
                connection.end()
                return false
            }

            queryString = "SELECT 'item_ID' = '" + data.id + "' FROM products"
            connection.query(queryString, function (err, res) {
                if (err) throw err;
                console.log(res);
            });
            connection.end()
        });
    });
}
