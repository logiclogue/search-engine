var mysql = require('mysql');
var env = require('../.env.json');
var crawl = require('./crawl.js');


function Database() {
    this.connection = mysql.createConnection({
        host: env.database.host,
        user: env.database.user,
        password: env.database.password,
        database: env.database.database
    });

    this.connection.connect();

    crawl.found = this.found;
}

module.exports = Database;
