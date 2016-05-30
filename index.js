var mysql = require('mysql');
var env = require('./.env.json');
var Crawl = require('./js/Crawl.js');

var connection = mysql.createConnection({
    host: env.database.host,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database
});
var search = 'url';
var crawl = new Crawl();

connection.connect();

connection.query('SELECT ?? FROM entries', [search], function (err, rows) {
    //console.log(rows[0][search]);
});

crawl.crawler.queue('http://reckit.co.uk');

crawl.found = function (url, title, description) {
    console.log(title);
};

connection.end();
