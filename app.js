console.log('Booting offPIM Server')

var PouchDB = require('pouchdb');
var cors = require('cors');
var express = require('express');
const path = require('path');

/*
 * Settings
 */

const listeningPortoffPIMUI = 3001;
const listeningPortPouchDBServer = 3000;

/*
 * Server
 */
var app = express();


app.use('/', require('express-pouchdb')(PouchDB));

app.listen(listeningPortPouchDBServer);

const appURLBase = 'http://localhost:';
const appURL = appURLBase + listeningPortPouchDBServer;

console.log(`PouchDB Server is available on ${appURL}`,
    `\n * Visit ${appURL}/_utils for administration`)

/* 
Friendly interface
*/

var appUI = express();

appUI.get('/', function(req, res) {
    res.redirect('/static');
})

appUI.use('/static', express.static(path.join(__dirname, 'public')))
appUI.listen(listeningPortoffPIMUI);

const appUIURL = appURLBase + listeningPortoffPIMUI;

console.log(`offPIM Friendly Interface is available on ${appUIURL}`)