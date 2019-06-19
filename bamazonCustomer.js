// DEPENDENCIES
// ====================================================
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Table = require('cli-table3');


// MySQL CONNECTION
// ====================================================
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect((err) => {
    if (err) throw (err);
    process.stdout.write('\033c\033[3J');
    console.log("APP LAUNCHED".bold.yellow);
    askAction();
});

// FUNCTIONS
// ====================================================

function askAction() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Show all products",
                "Place an order"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Show all products":
                    process.stdout.write('\033c\033[3J');
                    queryAll();
                    break;

                case "Place an order":
                    placeOrder();
                    break;
            }
        });
}

queryAll = () => {
    let query = "SELECT * FROM products";
    connection.query(query, (err, res) => {
        if (err) throw (err);
        let table = new Table({
            head: ['#', 'Product name', 'Department', 'Price', 'Stock']
            , colWidths: [5, 50, 25, 10, 10]
        });
        console.log("\nTHE TABLE OF ALL PRODUCTS:\n".bold.red);
        res.forEach((result) => {
            table.push([result.id, result.product_name, result.department_name, `$${result.price}`, result.stock_quantity]);
        });
        console.log(table.toString() + "\n");
        return askAction();
    })
};

placeOrder = () => {
    inquirer.prompt([
        {
            name: "product_id",
            type: "number",
            message: "What is your product's ID?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "product_q",
            type: "number",
            message: "How many units would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then((answer) => {
            let query = "SELECT * FROM products WHERE (id = ? AND stock_quantity >= ?)";
            connection.query(query, [answer.product_id, +answer.product_q], function (err, res) {
                if (err) throw (err);
                if (res) {
                    res.forEach((result) => {
                        console.log(
                            `
    YOUR RECEIPT:
    ==========================================
    #${result.id}
    Product name: ${result.product_name}
    Department: ${result.department_name}
    Price: $${result.price}
    Quantity: ${answer.product_q}
    YOUR TOTAL: $${(result.price * +answer.product_q).toFixed(2)}
    ==========================================
    `.bold.yellow);
                        let query2 = "UPDATE products SET ? WHERE ?";
                        let newQuantity = result.stock_quantity - +answer.product_q;
                        connection.query(query2, [{ stock_quantity: newQuantity }, { id: answer.product_id }], (err, res) => {
                            if (err) throw (err);
                            console.log(`Your product ` + `#${answer.product_id}`.bold.green + ` has been decreased in quantity`);
                            console.log(`Current stock for this product is ` + `${newQuantity}`.bold.green + `\n`);
                            return askAction();
                        });
                    });
                }
                if (isNaN(res) === false) {
                    console.log("\nInsufficient quantity or product ID doesn't exist! Please try another amount/product ID!\n".red);
                    return placeOrder();
                }
            })
        })
};