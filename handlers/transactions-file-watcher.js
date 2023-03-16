const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const moment = require('moment')

const inputFolderPath = path.join(__dirname, 'dump_files/transaction_data');
const outputFilePath = path.join('handlers/dump_files/transaction_data_JSON/transactions.json')

const transactionsFileWatcher = () => {
    try {
        fs.watch(inputFolderPath, (eventType, filename) => {
            if (eventType === 'rename' && filename.endsWith('.csv')) {
                console.log(`Detected new file: ${filename}`);

                // Read new CSV file and add data to transactionData object
                const transactionData = [];
                fs.createReadStream(path.join(inputFolderPath, filename))
                    .pipe(csv())
                    .on('data', (row) => {
                        // Create an object by CSV data
                        const transactionDataObj = {
                            transactionId: parseInt(row.transactionId),
                            productId: parseInt(row.productId),
                            transactionAmount: parseFloat(row.transactionAmount),
                            transactionDatetime: moment(row.transactionDatetime, 'YYYY-MM-DD HH:mm:ss').toISOString()
                        }
                        transactionData.push(transactionDataObj)

                    })
                    .on('end', () => {
                        console.log(`Finished processing file: ${filename}`);
                        // Check the file is exist in given path
                        if (fs.existsSync(outputFilePath)) {
                            fs.readFile(outputFilePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                const jsonData = JSON.parse(data);

                                // Search existing transactionId and update the city or product name
                                const mergedArray = jsonData.map((obj1) => {
                                    const matchingObj2 = transactionData.find((obj2) => obj2.transactionId === obj1.transactionId);
                                    if (matchingObj2) {
                                        return {
                                            ...obj1,
                                            ...matchingObj2,
                                        };
                                    }
                                    return obj1;
                                });

                                // Add new products in JSON
                                transactionData.forEach((obj2) => {
                                    const matchingObj1 = jsonData.find((obj1) => obj1.transactionId === obj2.transactionId);
                                    if (!matchingObj1) {
                                        mergedArray.push(obj2);
                                    }
                                });

                                // Write the updated object back to the file
                                fs.writeFile(outputFilePath, JSON.stringify(mergedArray), (err) => {
                                    if (err) throw err;
                                    console.log(`Transaction summary written to file: ${outputFilePath}`);
                                });
                            });
                        } else {
                            // Write transactionData to output file
                            fs.writeFile(outputFilePath, JSON.stringify(transactionData), (err) => {
                                if (err) throw err;
                                console.log(`Transaction summary written to file: ${outputFilePath}`);
                            });
                        }
                    });
            }
        });
    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    transactionsFileWatcher
}


