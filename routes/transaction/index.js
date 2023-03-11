const router = require('express').Router({ mergeParams: true });
const process = require('./../../helpers/process')

module.exports = () => {
    // Transaction by ID API
    router.get('/:id', async (req, res) => {
        const transactionData = process.getTransactionData(req.params.id);
        res.json(transactionData);
    })
    return router
}