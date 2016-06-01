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

    crawl.found = function (url, title, description, callback) {
        connection.query('SELECT url FROM websites WHERE url = ? LIMIT 1', url, function (err, rows) {
            var inserted = rows.length === 1;

            callback(inserted);

            if (!inserted) {
                insertDatabase(url, title, description);
            }
        });
        
        console.log(url, title, description);
    };
}

function insertDatabase(url, title, description) {
    connection.query('INSERT INTO websites (url, title, description) VALUES (?, ?, ?)', [url, title, description], function (err) {
        if (err) {
            return;
        }
    });
}
