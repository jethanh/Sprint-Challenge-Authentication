const db = require("../database/dbConfig");

module.exports = {
  find,
  insert,
  findByUsername,
};

function find() {
  return db("users");
}

function insert(user) {
  return db("users").insert(user);
}

function findByUsername(username) {
  return db("users").where({ username }).first();
}