// Importing required modules
const express = require('express');

// Import File Watcher to update file real time
const { transactionsFileWatcher } = require('./helpers/transactions-file-watcher')
const { productsFileWatcher } = require('./helpers/products-file-watcher')

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

// Creating routers for REST API calls
app.use('/assignment', require('./routes')());

// Starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
