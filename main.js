var fs = require('fs');
var cron = require('node-cron');
var helpers = require('./helpers');
var config = require('./config.json');

var waveHostName = 'secure.wavecable.com'
var waveIAMDataUsagePath = '/iam/usage/image';
var waveIAMLoginPath = '/iam/iam/login';

var loginFormData = `username=${config.username}&password=${config.password}`;

var loginRequestOptions = {
    hostname: waveHostName,
    path: waveIAMLoginPath,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    data: loginFormData
};
var dataUseageRequestOptions = {
    hostname: waveHostName,
    path: waveIAMDataUsagePath,
    headers: {
        'Cookie': ''
    },
    method: 'GET',
    encoding: 'binary'
};

function getDataUsage() {
    helpers.createSecureRequest(loginRequestOptions)
        .then((responseObj) => {
            dataUseageRequestOptions.headers['Cookie'] = responseObj.response.headers['set-cookie'];
            return helpers.createSecureRequest(dataUseageRequestOptions);
        })
        .then((responseObj) => {
            var dateString = (new Date()).toDateString().split(' ').join('-');
            fs.writeFile(`./data/usage-as-of-${dateString}.webp`, responseObj.data, 'binary', (err) => {
                if (err) {
                    throw err
                }
                console.log('Data usage fetched and saved.');
            });
        })
        .catch((error) => console.error(error));
}

// Initially get data usage upon initialization (This will be overwritten with latest at the end of the day)
getDataUsage();
// CRON job to get data usage right before midnight each day
cron.schedule(`59 59 23 * * *`, () => getDataUsage());