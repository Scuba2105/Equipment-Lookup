const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const { getAllDevices, getDevice, createDevice, updateDevice, badRequest } = require('./controllers/deviceController');


const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/equipment-lookup', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/equipment-lookup.html'));
});
// const server = http.createServer((req, res) => {

//     if (req.url === '/api/devices' && req.method == 'GET') {
//         getAllDevices(req, res);
//     }
//     else if ((/\/[\w]+$/ig).test(req.url) && req.method == 'GET') {
//         getDevice(req, res);   
//     }
//     else if (req.url === '/api/devices' && req.method == 'POST') {
//         createDevice(req, res)
//     }
//     else if (req.url === '/api/devices' && req.method == 'PUT') {
//         updateDevice(req, res)
//     }
//     else {
//         badRequest(req, res);
//     }
// })

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})