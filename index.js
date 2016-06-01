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

crawl.crawler.queue('http://reckit.co.uk');

database();


function database() {
    connection.connect();

    connection.query('SELECT ?? FROM entries', [search], function (err, rows) {
        //console.log(rows[0][search]);
    });

    crawl.found = function (url, title, description) {
        connection.query('INSERT INTO websites (url, title, description) VALUES (?, ?, ?)', [url, title, description], function (err) {
            if (err) {
                console.log(err);

                return;
            }
        });

        console.log(url, title, description);
    };
}
