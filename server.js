// Importing required modules
const express = require('express');

// Creating the Express application
const app = express();

// Setting the server port
const PORT = process.env.PORT || 8080;

// Establishing a connection to the server
app.get('/', (req, res) => {
  res.json('Connection established!');
});

// Creating routers for REST API calls
app.use('/assignment', require('./routes')());

// Starting the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
