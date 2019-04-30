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

  /**
 * Returns all the task history in the database
 * @returns {*}
 */
function get() {
    return db("taskHistory");
  }
  
  /**
 * Returns all the task history of the given group ID
 * @param id - The ID of the group
 * @returns {*} - Returns all information about the task history from the given ID
 */

function getByGroup(id) {
    return db
      .select("*")
      .from("taskHistory")
      .where("groupID", id);
  }

  /**
 * Return all task history owned by the given user ID
 * @param id - The ID of the user
 * @returns {*} - Returns every information owned by given user ID
 */
function getByUser(id) {
    return db
      .select("*")
      .from("taskHistory")
      .where("userID", id);
  }

  /**
 * Return all the task histories owned by the given user ID and group ID
 * @param userID - The ID of the user
 * @param groupID - The ID of the group
 * @returns {*} - Returns every information owned by given history
 */
function getById(groupID, userID) {
    return db.select("*").from("taskHistory").where({groupID}).where({userID});
  }