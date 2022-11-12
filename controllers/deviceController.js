const Device = require('../models/deviceModel');
const utils = require('../utils/writeDataToFile');

async function getAllDevices(req, res) {
    try {
        const equipment = await Device.findAll();
        
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(equipment));
        res.end();
    } catch (error) {
        console.log(error);
    }
}

async function getDevice(req, res) {
    try {
        model = req.url.split('/')[3];
               
        const equipment = await Device.find(model);
        
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(equipment));
        res.end();
    } catch (error) {
        console.log(error);
    }
}

async function createDevice(req, res) {
    try {
        
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const content = await Device.create(body);
            utils.writeDataToFile('/home/steven/WebDevelopment/learnNode/APINoFramework/data/medical-devices-data.json', content);
        });
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('The details have been added to the file');
    } catch (error) {
        console.log(error);
    }
}

async function updateDevice(req, res) {
    try {
        
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            const content = await Device.update(body);
            utils.writeDataToFile('/home/steven/WebDevelopment/learnNode/APINoFramework/data/medical-devices-data.json', content);
        });
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('The details have been updated in the file');
    } catch (error) {
        console.log(error);
    }
}

function badRequest(req, res) {
    try {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('<h1>Page Not Found</h1>');
        res.end(); 
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllDevices,
    getDevice,
    createDevice,
    updateDevice,
    badRequest
}