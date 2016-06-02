var mysql = require('mysql');
var env = require('./.env.json');
var crawl = require('./js/crawl.js');
var Database = require('./js/Database.js');


var database = new Database();

crawl.crawler.queue('http://reckit.co.uk');
