var db = require('../config/connection')
var collection = require('../config/collections')
module.exports = {


    addproduct: (product, callback) => {
        // console.log(product);

        db.get().collection("products").insertOne(product).then((data) => {
            console.log(data);
            callback(data.insertedId)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    }
}