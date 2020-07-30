console.log('Booting offPIM Server')

var PouchDB = require('pouchdb');
var cors = require('cors');
var express = require('express');
const path = require('path');
const open = require('open');

/*
 * Settings
 */

const listeningPortoffPIMUI = 3001;
const listeningPortPouchDBServer = 3000;
const configuredBindAddress = '127.0.0.1';
const appURLBase = 'http://localhost:';

/*
 * PouchDB Exress 
 * dbServer
 */
var app = express();
app.use('/', require('express-pouchdb')(PouchDB));
var dbServer,
    dbServerURL;

async function dbServerStart() {
    dbServerURL = appURLBase + listeningPortPouchDBServer;
    dbServer = await app.listen(listeningPortPouchDBServer, configuredBindAddress);
    return true
}

async function dbServerStop(restart = false) {
    await dbServer.close();
    if (restart) {
        await dbServerStart()
    }
    return true
}

console.log(`PouchDB Server is available on ${dbServerURL}`,
    `\n * Visit ${dbServerURL}/_utils for administration`)

/*
 * offPIM Server UI
 *
 */

var appUI = express();

appUI.get('/', function(req, res) {
    res.redirect('/static');
})

appUI.use('/static', express.static(path.join(__dirname, 'public')))

appUI.get('/config', function (req, res) {
    // TODO Fetch either here or frontend UI
    res.json({
        bindAddress: configuredBindAddress,
        dbServerURL: dbServerURL,
    })
})

appUI.get('/action/restart', async function (req, res) {
    await dbServerStop(true);
    res.json({
        restart: true,
        message: 'Restart successful'
    })
})

appUI.get('/action/shutdown', async function (req, res) {
    await dbServerStop();
    res.json({
        message: 'Stopped db server'
    })
})

appUI.get('/action/start', async function (req, res) {
    await dbServerStart();
    res.json({
        start: true,
        message: 'Starting db server'
    })
})

var uiServer;
uiServer = appUI.listen(listeningPortoffPIMUI, configuredBindAddress);
const appUIURL = appURLBase + listeningPortoffPIMUI;
console.log(`offPIM Friendly Interface is available on ${appUIURL}`)


dbServerStart();
open(appUIURL);
