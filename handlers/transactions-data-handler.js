const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const transactionDir = path.join('handlers/dump_files/transaction_data_JSON');

// Map to store transaction data by transaction ID
const transactionData = new Map();

// Function to process a transaction file and store data in the transactionData Map
function processTransactionFile(file) {
    const transactions = JSON.parse(fs.readFileSync(file));
    for (const transaction of transactions) {
        transactionData.set(transaction.transactionId, transaction);
    }
}

// Watch for changes in transaction files and update the transactionData Map
chokidar.watch(transactionDir).on('change', (file) => {
    if (file.endsWith('.json')) {
        processTransactionFile(file);
        console.log(`Transaction data updated from file: ${file}`);
    }
});

// Initialize transaction data by processing all existing transaction files
fs.readdir(transactionDir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    for (const file of files) {
        if (file.endsWith('.json')) {
            processTransactionFile(`${transactionDir}/${file}`);
        }
    }
});

// Class to handle transaction data
class TransactionHandler {
    constructor() {
        this.transactionData = transactionData;
    }

    // Method to get all transaction data
    getTransactionData() {
        return this.transactionData;
    }

    // Method to get transaction data for a given transaction ID
    getTransactionDataByID(transactionId) {
        return this.transactionData.get(transactionId);
    }

    // Method to get transaction summary by product or manufacturing city for a given number of days
    //   getTransactionSummary(type, days) {
    // TODO: Implement summary logic using the transactionData Map
    //   }
}

module.exports = TransactionHandler;
