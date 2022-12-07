/**
* @summary - Checks for null or undefined values
* @param {Object} inObj Requests passed to the express endpoint
* @returns Boolean
**/
exports.validateRequestForEmptyValues = (inObj) => {
	if (typeof inObj !== 'object' && inObj === null) {
        throw new Error("inObj must be an Object");
    }

	// cache object properties
	let inObjKeys = Object.keys(inObj);

	// loop through and check for null/falsy values
	// if found send back the offending property
	for (let i=0; i<inObjKeys.length; i++) {
		if (inObj[inObjKeys[i]] === null || inObj[inObjKeys[i]] === undefined) {
            throw new Error(`${inObjKeys[i]} is required`);
        }

		// validate array if it is empty
		if (inObj[inObjKeys[i]] && Array.isArray(inObj[inObjKeys[i]]) && (inObj[inObjKeys[i]].length === 0)) {
            throw new Error(`${inObjKeys[i]} cannot be empty`);
        }
	}

    // no issues 
    return true;
}

/**
 * @summary - Checks if a value is a number
 * @param {any} str 
 * @returns 
 */
exports.isNumber = (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str))
}