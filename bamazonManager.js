// DEPENDENCIES
// ====================================================
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const process = require("process");
const Table = require('cli-table3');
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
    process.stdout.write('\033c\033[3J');
    console.log("APP LAUNCHED".bold.yellow);
    askAction();
});

// FUNCTIONS
// ====================================================
var query = "";
function askAction() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    query = "SELECT * FROM products";
                    displayTable();
                    process.stdout.write('\033c\033[3J');
                    break;

                case "View Low Inventory":
                    lowInventory();
                    process.stdout.write('\033c\033[3J');
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

displayTable = () => {
    connection.query(query, (err, res) => {
        if (err) throw (err);
        console.log("\nTHE TABLE OF PRODUCTS:\n".bold.red);
        let table = new Table({
            head: ['#', 'Product name', 'Department', 'Price', 'Stock']
            , colWidths: [5, 50, 25, 10, 10]
        });
        res.forEach((result) => {
            table.push([result.id, result.product_name, result.department_name, `$${result.price}`, result.stock_quantity]);
        });
        console.log(table.toString() + "\n");
        return askAction();
    })
};

lowInventory = () => {
    query = "SELECT * FROM products WHERE stock_quantity <= ?";
    connection.query(query, "100", (err, res) => {
        if (err) throw (err);
        console.log("\nFOLLOWING ITEMS ARE OUT-OF-STOCK(SOON):\n".bold.red);
        let table = new Table({
            head: ['#', 'Product name', 'Department', 'Price', 'Stock']
            , colWidths: [5, 50, 25, 10, 10]
        });
        res.forEach((result) => {
            table.push([result.id, result.product_name, result.department_name, `$${result.price}`, result.stock_quantity]);
        });
        console.log(table.toString() + "\n");
        return askAction();
    });

};

addInventory = () => {

    inquirer.prompt([
        {
            name: "product_id",
            type: "number",
            message: "What product ID would you like to UPDATE?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "action",
            type: "rawlist",
            message: "Which section?",
            choices: [
                "Product name",
                "Department",
                "Price",
                "Stock"
            ]
        },
        {
            name: "value",
            type: "input",
            message: "What value?"
        }
    ])
        .then((answer) => {
            switch (answer.action) {
                case "Product name":
                    let query1 = "UPDATE products SET ? WHERE ?";
                    connection.query(query1, [{ product_name: `${answer.value}` }, { id: `${+answer.product_id}` }], (err, res) => {
                        if (err) throw (err);
                        console.log("Your product updated!\n");
                    })
                    query = `SELECT * FROM products WHERE (id=${+answer.product_id})`;
                    displayTable();
                    break;

                case "Department":
                    let query2 = "UPDATE products SET ? WHERE ?";
                    connection.query(query2, [{ department_name: `${answer.value}` }, { id: `${+answer.product_id}` }], (err, res) => {
                        if (err) throw (err);
                        console.log("Your product updated!\n");
                    })
                    query = `SELECT * FROM products WHERE (id=${+answer.product_id})`;
                    displayTable();
                    break;

                case "Price":
                    let query3 = "UPDATE products SET ? WHERE ?";
                    connection.query(query3, [{ price: `${answer.value}` }, { id: `${+answer.product_id}` }], (err, res) => {
                        if (err) throw (err);
                        console.log("Your product updated!\n");
                    })
                    query = `SELECT * FROM products WHERE (id=${+answer.product_id})`;
                    displayTable();
                    break;

                case "Stock":
                    let query4 = "UPDATE products SET ? WHERE ?";
                    connection.query(query4, [{ stock_quantity: `${answer.value}` }, { id: `${+answer.product_id}` }], (err, res) => {
                        if (err) throw (err);
                        console.log("Your product updated!\n");
                    })
                    query = `SELECT * FROM products WHERE (id=${+answer.product_id})`;
                    displayTable();
                    break;
            };
        })
};

addProduct = () => {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "Please enter your product name:"
        },
        {
            name: "productDepartment",
            type: "input",
            message: "Please enter your product department name:"
        },
        {
            name: "productPrice",
            type: "number",
            message: "Please enter your product price:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "productStock",
            type: "number",
            message: "Please enter your product stock quantity:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then((answer) => {
        let query5 = "INSERT INTO products SET ?";
        connection.query(query5, { product_name: answer.productName, department_name: answer.productDepartment, price: answer.productPrice, stock_quantity: answer.productStock }, (err, res) => {
            if (err) throw (err);
            console.log("Your product inserted!\n");
            if (isNaN(res) === false) {
                console.log("\nWrong entry!\n".red);
                return addProduct();
            }
            query = "SELECT * FROM products ORDER BY ID DESC LIMIT 1";
            displayTable();
        })
    });
}