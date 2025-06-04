const pool = require("./pool");

async function getUserByUsername(username) {
  const { rows } = await pool.query(
    "SELECT * FROM members WHERE username = $1",
    [username]
  );
  return rows[0];
}

async function storeNewMember(firstname, lastname, username, password) {
  await pool.query(
    "insert into members (firstname, lastname, username, password) values ($1, $2, $3, $4)",
    [firstname, lastname, username, password]
  );
}

module.exports = {
  getUserByUsername,
  storeNewMember
};
