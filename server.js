// Importing required modules
const express = require('express');

// Import File Watcher to update file real time
const { transactionsFileWatcher } = require('./handlers/transactions-file-watcher')
const { productsFileWatcher } = require('./handlers/products-file-watcher');

// Import Classes to use for API call
const TransactionHandler = require('./handlers/transactions-data-handler');
const ProductsHandler = require('./handlers/products-data-handler');


// Creating the Express application
const app = express();

// Setting the server port
const PORT = process.env.PORT || 8080;

// Establishing a connection to the server
app.get('/', (req, res) => {
  res.json('Connection established!');
});

// Run file Watcher to update new files in JSON
transactionsFileWatcher();
productsFileWatcher();

// Create the objects of TransactionHandler and ProductsHandler
const transactionDataObject = new TransactionHandler;
const productsDataObject = new ProductsHandler;

// Created middleware to read the objects of TransactionHandler and ProductsHandler
app.use((req, res, next) => {
  req.transactionDataObject = transactionDataObject;
  req.productsDataObject = productsDataObject;
  next();
});



// Creating routers for REST API calls
app.use('/assignment', require('./routes')());

// Listening port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
