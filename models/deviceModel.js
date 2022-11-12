const equipment = require('../public/data/medical-devices-data.json');

function findAll() {
    return new Promise((resolve, reject) => {
        resolve(equipment.medicalDevices);
    })
}

function find(model) {
    return new Promise((resolve, reject) => {
        selectedDevice = equipment.medicalDevices.find(device => {
            return device.model == model
        })
        resolve(selectedDevice);
    })
}

function create(newEntry) {
    return new Promise((resolve, reject) => {
        const newObject = JSON.parse(newEntry)
        equipment.medicalDevices.push(newObject);
        const newJSON = JSON.stringify(equipment);
        resolve(newJSON);
    })
}

function update(updateInfo) {
    return new Promise((resolve, reject) => {
        const updateObject = JSON.parse(updateInfo)
        
        const index = equipment.medicalDevices.findIndex(object => {
            return object.model == updateObject.model
        })
                
        const updateDevice = equipment.medicalDevices.find(device => {
            return device.model == updateObject.model
        });

        for (const property in updateObject) {
            console.log(`${property}: ${updateObject[property]}`)
            updateDevice[property] = updateObject[property];
            console.log(`${property}: ${updateDevice[property]}`)
        }

        console.log(updateObject.software);

        equipment.medicalDevices[index] = updateDevice;
        const updatedJSON = JSON.stringify(equipment);
        resolve(updatedJSON);
    })
}

module.exports = {
    findAll,
    find,
    create,
    update
}