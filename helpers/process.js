// Import necessary modules
const path = require('path');
const fs = require('fs');

// Define path to folder containing transaction data and product reference file
const transactionFolder = path.join(__dirname, 'product_data');
const productFile = path.join(transactionFolder, 'productReference.csv');

// Load product data from product reference file
const productData = {};
const fileData = fs.readFileSync(productFile, 'utf8').split('\n');
for (let i = 1; i < fileData.length; i++) {
    const dataRow = fileData[i].trim().split(',');
    productData[dataRow[0]] = { name: dataRow[1], manufacturingCity: dataRow[2] };
}

/**
 * Get transaction data for a given transaction ID
 *
 * @param {string} transactionId - The ID of the transaction to retrieve
 * @return {Object} - An object containing information about the transaction
 */
function getTransactionData(transactionId) {
    // Construct path to transaction file using transaction ID
    const transactionFile = path.join(transactionFolder, `Transaction_${transactionId}.csv`);

    // Load transaction data from file
    const transactionData = fs.readFileSync(transactionFile, 'utf8').split('\n')[transactionId];

    // Extract relevant information from transaction data
    const [id, productId, transactionAmount, transactionDate] = transactionData.split(',');
    const product = productData[productId];

    // Return transaction information as an object
    return {
        transactionId: id,
        productName: product.name,
        transactionAmount,
        transactionDate,
    };
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
    const now = new Date();
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000);

    // Initialize summary object
    const summary = {};

    // Loop through transaction files in transaction folder
    fs.readdirSync(transactionFolder).forEach((filename) => {
        const filePath = path.join(transactionFolder, filename);
        const fileData = fs.readFileSync(filePath, 'utf8').split('\n');

        // Loop through transaction data in file
        let i = 1;
        while (i < fileData.length) {
            const dataRow = fileData[i].trim().split(',');
            const transactionDate = new Date(dataRow[3]);

            // Check if transaction date falls within requested time range
            if (transactionDate >= startDate) {
                const productInfo = {
                    productId: dataRow[1],
                    transactionAmount: parseFloat(dataRow[2])
                }
                const product = productData[productInfo.productId];

                // Determine key for summary object based on requested summary type
                const key = type === 'summaryByProduct' ? product.name : product.manufacturingCity;

                // Initialize entry in summary object if it doesn't already exist
                if (!summary[key]) {
                    summary[key] = { totalAmount: 0 };
                }

                // Update total amount for current key
                summary[key].totalAmount += productInfo.transactionAmount;
            }
            i++;
        }
    });

    // Return summary information as an array of objects
    return { summary: Object.entries(summary).map(([key, value]) => ({ [type]: key, ...value })) };
}

module.exports = {
    getTransactionData,
    getTransactionSummary
}