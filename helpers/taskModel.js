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

  function getById(id) {
    return db
      .select("*")
      .from("task")
      .where({id});
  }
  
  function add(task) {
    return db("task")
        .returning("id")
      .insert(task)
      .into("task");
  }
  
  function update(id, changes) {
    return db("task")
      .returning("id")
      .where({ id })
      .update(changes);
  }
  
  function remove(id) {
    return db("task")
        .returning("id")
      .where({ id })
      .del();
  } 
  

// Export functions