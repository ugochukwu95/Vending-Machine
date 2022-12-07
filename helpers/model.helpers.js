const User = require('../models/users')
const Product = require('../models/products')
const Transaction = require('../models/transactions')

/**
* Finds a document by any property
*
* @param {String} Mongoose model to query
* @param {Object} 
*
* @return {MongooseObject} Returns the result of the find one operation
**/
exports.findOneDocument = async (model, obj) => {
	// validate arguments
	if (typeof model !== 'string') throw new Error("model must be a String")
	if (typeof obj !== 'object' || obj === null) throw new Error("second argument must be an Object")

	// value to send back
	let returnVal;

	// perform find operation
	switch(model) {
		case "User":
			returnVal = await User.findOne(obj)
			break;
        case "Product":
            returnVal = await Product.findOne(obj)
            break;
        case "Transaction":
            returnVal = await Transaction.findOne(obj)
            break;
		default:
			throw new Error("Invalid model")
	}

	return returnVal;
}

/**
 * Save new entries
 * 
 * @param {String} Model name
 * @param {Object} Model doc to save
 * 
 * @return {Object}
**/
exports.saveNewDoc = async (model, obj) => {
	// validate arguments
	if (typeof model !== 'string') throw new Error("model must be a String")
	if (typeof obj !== 'object' || obj === null) throw new Error("second argument must be an Object")

	// value to send back
	let returnVal;

	// perform save operation
	switch(model) {
        case "User":
			returnVal = await new User(obj).save()
            break;
        case "Product":
            returnVal = await new Product(obj).save()
            break;
        case "Transaction":
            returnVal = await new Transaction(obj).save()
            break;
		default:
			throw new Error("Invalid model")
	}

	return returnVal;
}

/**
* Finds a document and updates it
*
* @param {String} model Mongoose model to update
* @param {Object} docObj Mongoose object property and value to update
* @param {Object} inObj Items to update doc with
* @param {boolean} upsert whether to upsert
*
* @return {MongooseObject} Returns the result of the update operation
**/
exports.findDocumentToUpdate = async (model, docObj, inObj, upsert=false, useSet=false) => {
	// validate arguments, all arguments are required
	if (typeof model !== 'string') throw new Error("model must be a String")
	if (typeof inObj !== 'object' || inObj === null) throw new Error("inObj must be an Object")
	if (typeof docObj !== 'object' || docObj === null) throw new Error("docObj must be an Object")

	// value to send back
	let returnVal;

	// perform update operation
	switch(model) {
		case "User":
			returnVal = await User.findOneAndUpdate(docObj, (useSet ? {$set: inObj} : inObj), {new: true, upsert})
			break;
        case "Product":
            returnVal = await Product.findOneAndUpdate(docObj, (useSet ? {$set: inObj} : inObj), {new: true, upsert})
            break;
        case "Transaction":
            returnVal = await Transaction.findOneAndUpdate(docObj, (useSet ? {$set: inObj} : inObj), {new: true, upsert})
            break;
		default:
			throw new Error("Cannot find Model")
	}

	// validate update process
    if (!returnVal) {
        console.log(returnVal)
        throw new Error("Unable to update")
    }

	return returnVal;
}

/**
* Finds all documents
*
* @param {String} Mongoose model to update
*
* @return {MongooseObject} Returns the result of the update operation
**/
exports.findAllDocuments = async (model, obj=false) => {
	if (typeof model !== 'string') {
        throw new Error("'model' must be a String")
    }

	if (obj && (typeof obj !== 'object')) {
        throw new Error("second argument must be an Object")
    }

	let returnVal;

	switch(model) {
		case "User":
			returnVal = await User.find(obj ? obj : {})
			break;
		case "Product":
			returnVal = await Product.find(obj ? obj : {})
			break;
        case "Transaction":
            returnVal = await Transaction.find(obj ? obj : {})
            break;
		default:
			throw new Error("Invalid model")
	}

    if (!returnVal) {
        throw new Error("Cannot retrieve documents")
    }

	return returnVal;
}

/**
 * @summary - Deletes a document
 * @param {String} model 
 * @param {String} id 
 */
exports.findDocumentAndDelete = async (model, id) => {
    if (typeof model !== 'string') {
        throw new Error("'model' must be a String")
    }

    let returnVal;

	switch(model) {
		case "User":
			returnVal = await User.findByIdAndRemove(id)
			break;
		case "Product":
			returnVal = await Product.findByIdAndRemove(id)
			break;
        case "Transaction":
            returnVal = await Transaction.findByIdAndRemove(id)
            break;
		default:
			throw new Error("Invalid model")
	}

    if (!returnVal) {
        throw new Error("Cannot retrieve documents")
    }

	return returnVal;
}