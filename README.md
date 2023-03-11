# Unscrambl Coding Assignment
This is a Node.js application that processes transaction data and provides retrieval features through REST APIs. The application processes transaction data in real-time, which is received through files in a folder. It uses another folder to store reference data for products, against which the transactions are made.

## Installation
To install the necessary packages, run the following command in the terminal:

```bash
npm install
```
Running the Application
To start the application, run the following command in the terminal:

```bash
npm start
```
The application will start running and listening on http://localhost:8080.

## API Endpoints
GET /assignment/transaction/:transaction_id
This endpoint retrieves the details of a transaction based on the provided transaction ID. The output data is in JSON format and has the following fields:

```bash
{
  "transactionId": 1,
  "productName": "P1",
  "transactionAmount": 1000.0,
  "transactionDatetime": "2023-03-10 10:10:10"
}
```
GET /assignment/transactionSummaryByProducts/:last_n_days
This endpoint retrieves the summary of transactions made by product name during the last n days. The input parameter last_n_days is a number indicating the number of days to consider for the summary. The output data is in JSON format and has the following fields:


```bash
{
  "summary": [
    {
      "productName": "P1",
      "totalAmount": 3000.0
    }
  ]
}
```
GET /assignment/transactionSummaryByManufacturingCity/:last_n_days
This endpoint retrieves the summary of transactions made by manufacturing city during the last n days. The input parameter last_n_days is a number indicating the number of days to consider for the summary. The output data is in JSON format and has the following fields:


```bash
{
  "summary": [
    {
      "cityName": "C1",
      "totalAmount": 3000.0
    }
  ]
}
```
## Dependencies
This application uses the following dependencies:

express - A fast, unopinionated, minimalist web framework for Node.js.
csv-parser - A CSV parsing and encoding package for Node.js.

## Notes
* The transaction data is assumed to be in the format Transaction_YYYYMMDDHHmmss.csv. For example, Transaction_20180101101010.csv.
* The reference data for products is assumed to be in a file named ProductReference.csv.
* This application is an in-memory application, so no persistent storage is required. The transaction data is reloaded upon startup of the application.
