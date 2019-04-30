// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
    get,
    getByGroup,
    getByUser,
    getById,
    add,
    update,
    remove
  }