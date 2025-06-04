const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgressql://akr4m:shoyo@localhost:5432/onlymembers"
});

module.exports = pool 