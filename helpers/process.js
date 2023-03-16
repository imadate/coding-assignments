/**
 * Get transaction data for a given transaction ID
 *
 * @param {Object} transactionDataObject - The ID of the transaction to retrieve
 * @param {string} transactionId - The ID of the transaction to retrieve
 * @return {Object} - An object containing information about the transaction
 */
function getTransactionData(transactionDataObject, transactionId) {
    return transactionDataObject.transactionData.get(parseInt(transactionId))

}

/**
 * Get transaction summary by product or manufacturing city for a given number of days
 *
 * @param {string} type - The type of summary to generate ('summaryByProduct' or 'summaryByCity')
 * @param {string} days - The number of days to include in the summary
 * @return {Object} - An object containing the summary information
 */

function getTransactionSummary(type, transactionDataObject, productsDataObject, days) {
    // Calculate start date for summary based on number of days requested
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Initialize summary object
    const summary = {};
    // Loop through transaction data
    transactionDataObject.transactionData.forEach((transaction) => {
        const transactionDate = new Date(transaction.transactionDatetime);
        // Check if transaction date falls within requested time range
        if (transactionDate <= startDate) {
            const productInfo = {
                productId: transaction.productId,
                transactionAmount: parseFloat(transaction.transactionAmount)
            };
            const product = productsDataObject.productsData.get(parseInt(productInfo.productId))
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