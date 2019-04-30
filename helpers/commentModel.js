// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
    get,
    getByGroup,
    getByUser,
    getById,
    getByTask,
    add,
    update,
    remove
  }

  function get() {
    return db("comments");
  }
  
  function getByGroup(groupId) {
    return db
      .select("*")
      .from("comments")
      .where("groupID", groupId);
  }
  
  function getByUser(userId) {
    return db
      .select("*")
      .from("comments")
      .where("commentedBy", userId);
  }

  function getByTask(taskId) {
    return db
      .select("*")
      .from("comments")
      .where("taskID", taskId);
  }
  
  function getById(id) {
    return db
      .select("*")
      .from("comments")
      .where({ id });
  }
  
  function add(comment) {
    return db("comments")
        .returning("id")
      .insert(comment)
      .into("comments");
  }
  
  function update(id, changes) {
    return db("comments")
      .returning("id")
      .where({ id })
      .update(changes);
  }
  
  function remove(id) {
    return db("comments")
        .returning("id")
      .where({ id })
      .del();
  }
  