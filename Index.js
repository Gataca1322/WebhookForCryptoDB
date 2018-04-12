const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./apiKey');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-crypto-details', (req, res) => {

    const cryptoToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.crypto ? req.body.result.parameters.crypto : 'Bitcoin';
    const reqUrl = encodeURI(`http://www.coinapi.io/?t=${cryptoToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const crypto = JSON.parse(completeResponse);
            let dataToSend = cryptoToSearch === 'Bitcoin' ? `I don't have the required info on that. Here's some info on 'Bitcoin' instead.\n` : '';
            dataToSend += `${crypto.asset_id} is a ${crypto.Name} starer ${crypto.Symbol_id} crypto, its current rate ${crypto.Rate}.`;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-crypto-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-crypto-details'
        });
    });
});

server.listen((process.env.PORT || 5000), () => {
    console.log("Server is up and running...");
});