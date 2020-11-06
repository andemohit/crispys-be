const express = require('express');
const app = express();
var port = process.env.port || 1337;

const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());

const productController = require('./controller/products/productController')();
const brandController = require('./Controller/BranchesController')();

app.get("/product", function (request, response) {
    response.json({ "Message": "Welcome to Node js" });
});

app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use('/api/products', productController);
app.use('/api/branches', brandController);