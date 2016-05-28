var mysql = require('mysql');
var env = require('./.env.json');
var crawl = require('./js/crawl.js');

var connection = mysql.createConnection({
    host: env.database.host,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database
});
var search = 'url';

connection.connect();

connection.query('SELECT ?? FROM entries', [search], function (err, rows) {
    console.log(rows[0][search]);
});

crawler.queue('http://reckit.co.uk');

connection.end();
