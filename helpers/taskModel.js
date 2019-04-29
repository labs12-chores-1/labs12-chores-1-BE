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

  function get() {
      return db("task");
  }

  function getByGroup(groupId) {
    return db
      .select("*")
      .from("task")
      .where("groupID", groupId);
  }

  function getByUser(userId) {
    return db
      .select("*")
      .from("task")
      .where("createdBy", userId);
  }
  

// Export functions