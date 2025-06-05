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

async function checkSession(sid) {
  const { rows } = await pool.query("SELECT * FROM sessions WHERE sid = $1", [
    sid,
  ]);
  console.log("from the queries ", rows);
  return rows;
}

async function addNewPost(username, firstname, lastname, title, content) {
  await pool.query(
    "INSERT INTO posts (username, firstname, lastname, title, content) VALUES ($1, $2, $3, $4, $5)",
  [username, firstname, lastname, title, content]);
}

async function getAllPosts(){
  const { rows } = await pool.query("SELECT * FROM posts");
  return rows;
}

module.exports = {
  getUserByUsername,
  storeNewMember,
  checkSession,
  addNewPost,
  getAllPosts
};
