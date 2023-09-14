const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "NotSharingMyPassword",
    database: "picturegalary"
});

module.exports = pool.promise();