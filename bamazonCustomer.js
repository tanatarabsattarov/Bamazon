// DEPENDENCIES
// ====================================================
const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});


// MySQL CONNECTION
// ====================================================
connection.connect((err) => {
    if (err) throw (err);
    console.log("connected as id " + connection.threadId);
    queryAll();
});

// FUNCTIONS
// ====================================================
queryAll = () => {
    let query = "SELECT * FROM products";
    connection.query(query, (err, res) => {
        if (err) throw (err);
        res.forEach((result) => console.log(
            `
#${result.id}
Product name: ${result.product_name}
Department: ${result.department_name}
Price: $${result.price}
Stock: ${result.stock_quantity}
========================================================================
`
        ));
    })
    placeOrder();
};

placeOrder = () => {
    inquirer.prompt([
        {
            name: "product_id",
            type: "input",
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
            type: "input",
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
    YOUR TOTAL: $${result.price * +answer.product_q}
    ==========================================
    `);
                        let query2 = "UPDATE products SET ? WHERE ?";
                        let newQuantity = result.stock_quantity - +answer.product_q;
                        connection.query(query2, [{ stock_quantity: newQuantity }, { id: answer.product_id }], (err, res) => {
                            if (err) throw (err);
                            console.log("Your product #" + answer.product_id + " has been decreased in quantity");
                            console.log("Current stock for this product is " + newQuantity);
                        });
                    });
                }
                if (isNaN(res) === false) {
                    console.log("\nInsufficient quantity or product ID doesn't exist! Please try another amount/product ID!");
                }
            })
        })
};