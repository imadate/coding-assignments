const router = require('express').Router({ mergeParams: true });
const process = require('./../../helpers/process')

module.exports = () => {
    // Transaction summary by manufacturing city API
    router.get('/:days', async (req, res) => {
        const summaryData = process.getTransactionSummary('summeryByManufacturingCity', req.params.days);
        res.json(summaryData);
    })
    return router
}