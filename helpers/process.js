// Import necessary modules
const path = require('path');
const fs = require('fs');

// Define path to folders containing transaction data and product reference file
const transactionDir = path.join(__dirname, 'dump_files/transaction_data_JSON')
const productsDir = path.join(__dirname, 'dump_files/product_data_JSON')


/**
 * Get transaction data for a given transaction ID
 *
 * @param {string} transactionId - The ID of the transaction to retrieve
 * @return {Object} - An object containing information about the transaction
 */
function getTransactionData(transactionId) {
    // Access path of transsaction JSON file
    const transactionData = path.join(transactionDir, 'transactions.json');

    // Read file data and store in JSON format
    const transactionJSON = JSON.parse(fs.readFileSync(transactionData, 'utf8'));

    // Find transactionID from stored JSON array
    const findTransactionData = transactionJSON.find(ele => ele.transactionId == transactionId)

    // Return transaction information as an object
    return findTransactionData
}

/**
 * Get transaction summary by product or manufacturing city for a given number of days
 *
 * @param {string} type - The type of summary to generate ('summaryByProduct' or 'summaryByCity')
 * @param {string} days - The number of days to include in the summary
 * @return {Object} - An object containing the summary information
 */

function getTransactionSummary(type, days) {
    // Calculate start date for summary based on number of days requested
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Initialize summary object
    const summary = {};

    // Access path of JSON files
    const transactionData = path.join(transactionDir, 'transactions.json');
    const productData = path.join(productsDir, 'products.json');

    // Read file data and store in JSON format
    const transactionJSON = JSON.parse(fs.readFileSync(transactionData, 'utf8'));
    const productsJSON = JSON.parse(fs.readFileSync(productData, 'utf8'));

    // Loop through transaction data in file
    transactionJSON.forEach((transaction) => {
        const transactionDate = new Date(transaction.transactionDatetime);
        // Check if transaction date falls within requested time range
        if (transactionDate <= startDate) {
            const productInfo = {
                productId: transaction.productId,
                transactionAmount: parseFloat(transaction.transactionAmount)
            };
            const product = productsJSON.find(ele => ele.productId == productInfo.productId)
            // Determine key for summary object based on requested summary type
            const key = type === 'summaryByProduct' ? product.productName : product.productManufacturingCity;

            // Initialize entry in summary object if it doesn't already exist
            if (!summary[key]) {
                summary[key] = { totalAmount: 0 };
            }

            // Update total amount for current key
            summary[key].totalAmount += productInfo.transactionAmount;
        }
    });

    // Return summary information as an array of objects
    return { summary: Object.entries(summary).map(([key, value]) => ({ [type]: key, ...value })) };
}

module.exports = {
    getTransactionData,
    getTransactionSummary
}