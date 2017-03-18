var http = require('http');
var config = require('./config.json');

var waveHostName = 'secure.wavecable.com'
var waveDataUsageUrl = waveBaseUrl + '/iam/usage/data';
var waveLoginUrl = waveBaseUrl + '/iam/login';
var waveIndexUrl = waveBaseUrl + '/iam/index';

// First login to Wave IAM page
http.request({
    hostname: waveHostName,
    protocol: 'https',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})