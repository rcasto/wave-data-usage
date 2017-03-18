var fs = require('fs');
var cron = require('node-cron');
var helpers = require('./helpers');
var config = require('./config.json');

var waveHostName = 'secure.wavecable.com'
var loginRequestOptions = {
    hostname: waveHostName,
    path: '/iam/iam/login',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    data: `username=${config.username}&password=${config.password}`
};
var dataUseageRequestOptions = {
    hostname: waveHostName,
    path: '/iam/usage/image',
    headers: {
        'Cookie': ''
    },
    method: 'GET',
    encoding: 'binary'
};

function getAndSaveDataUsage(path = `${config.dataStore}/${config.dataFilePrefix}.webp`) {
    path = pathTransform(path);
    return getDataUsage()
        .then((dataUsage) => saveDataUsage(path, dataUsage))
        .then(() => console.log(`Wrote data usage to ${path}`))
        .catch((error) => console.error(`An error occurred: ${error}`));
}

function getDataUsage() {
    return helpers.createSecureRequest(loginRequestOptions)
        .then((responseObj) => {
            dataUseageRequestOptions.headers['Cookie'] = responseObj.response.headers['set-cookie'];
            return helpers.createSecureRequest(dataUseageRequestOptions);
        })
        .then((responseObj) => responseObj.data);
}

function saveDataUsage(path, dataUsage) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, dataUsage, 'binary', (err) => {
            if (err) {
                reject(err);
            }
            resolve(dataUsage);
        });
    });
}

function pathTransform(path) {
    var pathParts = path.split('.');
    var dateString = (new Date()).toDateString().split(' ').join('-');
    return `${pathParts[0]}-${dateString}.${pathParts[1]}`;
}

// Initially get data usage upon initialization (This will be overwritten with latest at the end of the day)
getAndSaveDataUsage();
// CRON job to get data usage right before midnight each day
cron.schedule(`${config.cronTab}`, getAndSaveDataUsage);