const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const productsDir = path.join('handlers/dump_files/product_data_JSON');

// Map to store products data by products ID
const productsData = new Map();

// Function to process a products file and store data in the productsData Map
function processProductsFile(file) {
    const products = JSON.parse(fs.readFileSync(file));
    for (const product of products) {
        productsData.set(product.productId, product);
    }
}

// Watch for changes in products files and update the productsData Map
chokidar.watch(productsDir).on('change', (file) => {
    if (file.endsWith('.json')) {
        processProductsFile(file);
        console.log(`Products data updated from file: ${file}`);
    }
});

// Initialize products data by processing all existing products files
fs.readdir(productsDir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    for (const file of files) {
        if (file.endsWith('.json')) {
            processProductsFile(`${productsDir}/${file}`);
        }
    }
});

// Class to handle products data
class ProductsHandler {
    constructor() {
        this.productsData = productsData;
    }

    // Method to get all products data
    getProductsData() {
        return this.productsData;
    }
}

module.exports = ProductsHandler;
