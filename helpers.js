var http = require('http');
var https = require('https');

function makeRequest(requestObject, options) {
    return new Promise((resolve, reject) => {
        var request = requestObject.request(options, (res) => {
            var responseData = '';
            if (res.statusCode !== 200) {
                return reject(`Received ${res.statusCode} status code as response.\n${res}`);
            }
            res.setEncoding(options.encoding ? options.encoding : 'utf8');
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => resolve({
                response: res,
                data: responseData
            }));
        }).on('error', reject);

        if (options.data) {
            request.setHeader('Content-Length', Buffer.byteLength(options.data));
            request.write(Buffer.from(options.data));
        }

        request.end();
    });
}

function createRequest(options) {
    // https.request({}, (res) => res.)
    return makeRequest(http, options);
}

function createSecureRequest(options) {
    return makeRequest(https, options);
}

module.exports = {
    createRequest,
    createSecureRequest
};