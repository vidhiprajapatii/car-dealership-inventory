const { getDB } = require("../database/db");

async function createUser(name, email, password, role = "user") {
  const db = getDB();

  const result = await db.run(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, password, role]
  );

  return result.lastID;
}

async function findUserByEmail(email) {
  const db = getDB();

  return await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
}

module.exports = {
  createUser,
  findUserByEmail
};