// lightweight util for conversion between hex and utf8 from web3
// do not want to drizzleConnect all component or initialize web3 to use web3.utils
/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method hexToUtf8
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */

const Web3 = require('web3');
const web3 = new Web3();

module.exports = web3.utils