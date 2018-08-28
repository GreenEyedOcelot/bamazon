var mysql = require("mysql");
var prompt = require("prompt");
var inquirer = require("inquirer");
const cTable = require('console.table');
var productList = null;
const THE_HOST = "localhost";
const THE_USER = "root";
const THE_DATABASE = "bamazon";
const THE_USER = "root";
const THE_PASSWORD = "Scout825";
const THE_PORT = 3306;

showTable();

function showTable() {
   var selectStr = "SELECT products.product_id, products.product_name, departments.department_name, products.product_price, products.product_quantity FROM products INNER JOIN departments ON products.department = departments.department_id";
   var connection = mysql.createConnection({
      host: THE_HOST,
   
      // Your port; if not 3306
      port: THE_PORT,
   
      // Your username
      user: THE_USER,
   
      // Your password
      password: THE_PASSWORD,
      database: THE_DATABASE
   });

   connection.query(selectStr, function (err, res) {
      var setHeadings = (obj) => {
         return {
            "ID": obj["product_id"],
            "Product": obj["product_name"],
            "Department": obj["department_name"],
            "Price": obj["product_price"],
            "Available": obj["product_quantity"]
         };
      }
      if (err) {
          throw err;
      } else {
         productList = cTable.getTable(res.map(setHeadings));
         console.log(productList);
         connection.end();
         promptForPurchase();
      }
     
   });
}





function promptForPurchase() {
   var idIsValid = (id) => id && !Number.isNaN(id) && productList.some((obj) => obj.ID == id);
   var quantityIsValid = (id, q) => q && !Number.isNaN(q) && q > 0 &&
      q <= productList.filter((obj) => obj.ID == id)[0].Available;
   var id = null;

   console.log("Please enter a valid product id.");
   prompt.get([{

         name: 'id',
         warning: 'Please enter a valid product id.'
         empty: false,
         conform: function (val) {
            return idIsValid(val);
         }
      }], function (err, result) {
         if (err) {
            console.log("there is an error when entering an id, it is...", err);
         } else {
            id = result.id;
         }
      })

      console.log("Please enter a valid product id".);
      prompt.get([{

         name: 'quantity',
         warning: 'Please enter a quantity less than or equal to the available units.',
         empty: false,
         conform: function (val) {
            return quantityIsValid(id,val);
         }
      }], function (err, result) {
         if (err) {
            console.log("there is an error when entering a quantity, it is...", err);
         } else {
            console.log("quantity is valid");
            subtractQuantityAndShowTableAgain(id,quantity);
         }
      })


function subtractQuantityAndShowTableAgain(quantity) {
   
   var selectStr = "UPDATE PRODUCTS SET product_quantity = product_quantity - " + quantity + " WHERE product_id = 5";
   var connection = mysql.createConnection({
      host: THE_HOST,
   
      // Your port; if not 3306
      port: THE_PORT,
   
      // Your username
      user: THE_USER,
   
      // Your password
      password: THE_PASSWORD,
      database: THE_DATABASE
   });

   connection.query(selectStr, function (err, res) {
      if (err) {
          throw err;
      } else {
         productList = cTable.getTable(res.map(setHeadings));
         console.log(productList);
         connection.end();

         showTable();
      }
     
   });


}






   }

