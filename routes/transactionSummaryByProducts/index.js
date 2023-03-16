const router = require('express').Router({ mergeParams: true });
const process = require('../../helpers/process')

module.exports = () => {
    // Transaction summary by product API
    router.get('/:days', async (req, res) => {
        const summaryData = process.getTransactionSummary('summaryByProduct', req.transactionDataObject, req.productsDataObject, req.params.days);
        res.json(summaryData);
    });
    return router
}