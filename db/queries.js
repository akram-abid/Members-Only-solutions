const pool = require("./pool")

async function getUserByUsername(username){
    const { rows } = await pool.query("SELECT * FROM members WHERE username = $1", [username])
    return rows[0]
}

module.exports = {
    getUserByUsername,
}