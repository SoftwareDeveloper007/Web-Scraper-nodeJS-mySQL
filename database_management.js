var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passion1989",
    database: "testDB"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS test (id INT(11) NOT NULL AUTO_INCREMENT," +
        "first_name varchar(255) NOT NULL," +
        "last_name varchar(255) NOT NULL," +
        "location varchar(255) NOT NULL," +
        "charge varchar(255) NOT NULL," +
        "link varchar(255) NOT NULL," +
        "PRIMARY KEY (id)," +
        "UNIQUE(link)" +
        ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});

exports = module.exports = con;
