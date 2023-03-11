// Importing required modules
const express = require('express');

// Creating the router
const routes = express.Router({ mergeParams: true });

// Creating routes for REST API calls
routes.use('/transaction', require('./transaction')());
routes.use('/transactionSummaryByProducts', require('./transactionSummaryByProducts')());
routes.use('/transactionSummaryByManufacturingCity', require('./transactionSummaryByManufacturingCity')());

// Exporting the router
module.exports = () => {
  return routes;
};