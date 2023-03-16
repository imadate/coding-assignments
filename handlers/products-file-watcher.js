const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const inputFolderPath = path.join(__dirname, 'dump_files/product_data');
const outputFilePath = path.join('handlers/dump_files/product_data_JSON/products.json')

const productsFileWatcher = () => {
    try {
        fs.watch(inputFolderPath, (eventType, filename) => {
            if (eventType === 'rename' && filename.endsWith('.csv')) {
                console.log(`Detected new file: ${filename}`);

                // Read new CSV file and add data to transactionData object
                const productsData = [];
                fs.createReadStream(path.join(inputFolderPath, filename))
                    .pipe(csv())
                    .on('data', (row) => {
                        // Create an object by CSV data
                        const productDataObj = {
                            productId: parseInt(row.productId),
                            productName: row.productName,
                            productManufacturingCity: row.productManufacturingCity
                        }
                        productsData.push(productDataObj)

                    })
                    .on('end', () => {
                        console.log(`Finished processing file: ${filename}`);
                        // Check the file is exist in given path
                        if (fs.existsSync(outputFilePath)) {
                            // Read the file data
                            fs.readFile(outputFilePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }

                                // Save file data in a variable
                                const jsonData = JSON.parse(data);

                                // Search existing productId and update the city or product name
                                const mergedArray = jsonData.map((obj1) => {
                                    const matchingObj2 = productsData.find((obj2) => obj2.productId === obj1.productId);
                                    if (matchingObj2) {
                                        return {
                                            ...obj1,
                                            ...matchingObj2,
                                        };
                                    }
                                    return obj1;
                                });

                                // Add new products in JSON
                                productsData.forEach((obj2) => {
                                    const matchingObj1 = jsonData.find((obj1) => obj1.productId === obj2.productId);
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
                            // Write productsData to output file
                            fs.writeFile(outputFilePath, JSON.stringify(productsData), (err) => {
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
    productsFileWatcher
}


