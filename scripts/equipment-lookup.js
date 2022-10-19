// Import the data for the json file and store in an array
const equipmentArray = []; 

function handleError(err) {
    console.log(err);
}

async function getData() {
    const rawData = await fetch("../json/medical-devices-data.json").catch(handleError);
    const jsonData = await rawData.json();
    equipmentArray.push(...jsonData.medicalDevices)
    await initialiseEquipmentFields(equipmentArray);
}

getData();

// Define the variables required for the search functionality.
const searchList = document.querySelector('.search-list');
const searchBox = document.querySelector('.searchbox');
searchBox.addEventListener('keyup', displayMatches);
searchBox.addEventListener('change', displayMatches);

// Define the variables for updating the information when
// search button is pressed
const searchButton = document.querySelector('.search-button');
const modelTitle = document.querySelector('.model');
const typeAndManufacturer = document.querySelector('.other-information');
const deviceImage = document.querySelector('.image'); 
const usrManual = document.querySelector('.first-child');
const srvManual = document.querySelector('.second-child');
const configuration = document.querySelector('.third-child');
const software = document.querySelector('.fourth-child');
const placehold1 = document.querySelector('.fifth-child');
const placehold2 = document.querySelector('.sixth-child');

// Select all 6 elements document elements eg manuals, config, software etc.
const importantDocuments = document.querySelectorAll('.documents a');

// Event listeners for device documents
importantDocuments.forEach(document => {
    document.addEventListener('click', enableDisableClick);
})

// Search function event listeners
searchButton.addEventListener('click', getSelectedDevice);
searchList.addEventListener('click', addToSearchBar);
window.addEventListener("keydown", enterInputData);

// Sidebar menu options node list
menuOptions = document.querySelectorAll('.category');

// Event listeners for each menu option
menuOptions.forEach(option => {
    option.addEventListener('click', openSubMenu);
})

// Filter the equipment array to match the search input 
function findMatches(wordToMatch, devices) {
    filteredDevices = devices.filter((device) => {
        const model = device.model;
        const type = device.type;
        const manufacturer = device.manufacturer;
        const regex = new RegExp(wordToMatch, 'gi');
        return model.match(regex) || type.match(regex) || manufacturer.match(regex) 
    })
    return filteredDevices.sort((a, b) => {
        return a.model < b.model ? -1 : 1;
    });
}

// Display the filtered array as a list.
function displayMatches() {
    const matchArray = findMatches(this.value, equipmentArray);
    const html = matchArray.map(device => {
        const regex = new RegExp(this.value, 'gi');
        const deviceModel = device.model.replace(regex, function(match) {
            return `<span class="hl">${match}</span>`});
        const deviceType = device.type.replace(regex, function(match) {
            return `<span class="hl">${match}</span>`});
        const deviceManufacturer = device.manufacturer.replace(regex, function(match) {
            return `<span class="hl">${match}</span>`});
        return `
        <li class="suggestion">
            <span class="data">${deviceModel}, ${deviceType}, ${deviceManufacturer}</span>
        </li>
        `        
    }).join('');
    searchList.style.visibility = 'visible';
    searchList.innerHTML = html;
    // Reset the search list if the searchbox empty
    if (this.value.length == 0) {
        searchList.innerHTML = "";
        searchList.style.visibility = 'hidden';
    }
}

// Add the selected result to the search bar
function addToSearchBar(event) {
    if (event.target.classList.contains('suggestion')) {
        searchBox.value = event.target.firstElementChild.textContent
        searchList.innerHTML = "";
        searchList.style.visibility = 'hidden';
    }
    else {
        searchBox.value = event.target.textContent;
        searchList.innerHTML = "";
        searchList.style.visibility = 'hidden';
    }
}

// Find the device data and add it when selected
function getModel(inputString) {
    splitString = inputString.split(', ');
    const modelString = splitString.length == 1 ? inputString : splitString[0];
    const regex = new RegExp(modelString, 'ig');
    const filteredArray = equipmentArray.filter(device => {
        return device.model.match(regex)   
    })
    
    // Determine if input string is valid and unique else report error
    if (filteredArray.length == 0) {
        alert('Equipment does not exist in data file. Please contact administrator if it needs to be added')
    }
    else if (filteredArray.length == 1 || filteredArray[0].model == 'MX40') {
        return filteredArray[0].model 
    }
    else {
        alert('Invalid input. Please refine your search');
    }
}

function setFormatting(device, sectionVariable, sectionKey, index) {
    if (device[sectionKey].length == 0) {
        sectionVariable.style.opacity = 0.3;
        sectionVariable.style.cursor = 'default';
        importantDocuments[index].style.setProperty('--scale-amount', 1);
    }
    else {
        sectionVariable.style.opacity = 1;
        sectionVariable.style.cursor = 'pointer';
        importantDocuments[index].style.setProperty('--scale-amount', 1.1);
    }
    sectionVariable.setAttribute('href', device[sectionKey]);
}

function updateEquipmentFields(device) {
    // Set the user manual display and href attribute
    setFormatting(device, usrManual, 'userManual', 0);
           
    // Set the service manual display and href attribute
    setFormatting(device, srvManual, 'serviceManual', 1);
        
    // Set the config display and href attribute 
    setFormatting(device, configuration, 'config', 2)
        
    // Set the software display and href attribute
    setFormatting(device, software, 'software', 3)
        
    // Set the placeholder 1 display and href attribute
    setFormatting(device, placehold1, 'placeholder1', 4)
        
    // Set the placeholder 2 display and href attribute
    setFormatting(device, placehold2, 'placeholder2', 5)
}

function getSelectedDevice() {
    const input = searchBox.value;
    searchBox.value = "";
    searchList.style.visibility = 'hidden';
    const modelName = getModel(input);
    const selectedDevice = equipmentArray.find(device => {
        return device.model == modelName;
    });
    // If invalid input return nothing else update
    if (modelName.length == 0) {
        return
    }
    else {
        modelTitle.textContent = modelName;
        typeAndManufacturer.innerHTML = `<span class="type">${selectedDevice.type}</span>, <span class="manufacturer">${selectedDevice.manufacturer}</span>`; 
        deviceImage.setAttribute('src', selectedDevice.img);
        updateEquipmentFields(selectedDevice);
    }
}

function initialiseEquipmentFields(data) {
    const modelName = modelTitle.textContent
    const selectedDevice = data.find(device => {
        return device.model == modelName;
    });
    updateEquipmentFields(selectedDevice);
}

function enableDisableClick(event) {
    const active = event.target.style.opacity == 1 ? true : false;
    if (!active) {
        event.preventDefault();
    }
}

// Enter the data in the searchbox if enter key pressed
function enterInputData(event) {
    if (event.key == 'Enter' && searchBox.value.length !=0) {
        getSelectedDevice();
    };
}

// Adjust the sidebar menu for when options are clicked
function rotateArrow(element) {
    menuOptions.forEach((option, index) => {
        option.querySelector(':last-child').setAttribute('class', `arrow${index + 1}`);
    })
    // If statements based on which sidebar menu option is selected. 
    // The arrow is changed and the submenu is displayed.
    if (element.firstElementChild.classList.contains('admin')) {
        element.querySelector(':last-child').classList.add('menu1-clicked'); 
    }
    else if (element.firstElementChild.classList.contains('technical')) {
        element.querySelector(':last-child').classList.add('menu2-clicked');
    }
    else if (element.firstElementChild.classList.contains('contacts')) {
        element.querySelector(':last-child').classList.add('menu3-clicked');
    }
    else if (element.firstElementChild.classList.contains('database')) {
        element.querySelector(':last-child').classList.add('menu4-clicked');
    }
    else if (element.firstElementChild.classList.contains('alerts')) {
        element.querySelector(':last-child').classList.add('menu5-clicked');
    }
    else if (element.firstElementChild.classList.contains('training')) {
        element.querySelector(':last-child').classList.add('menu6-clicked');
    }
    else if (element.firstElementChild.classList.contains('ohs')) {
        element.querySelector(':last-child').classList.add('menu7-clicked');
    }
    else if (element.firstElementChild.classList.contains('procurement')) {
        element.querySelector(':last-child').classList.add('menu8-clicked');
    }
    else {
        element.querySelector(':last-child').classList.add('menu9-clicked');
    }
}

function openSubMenu() {
    rotateArrow(this);    
}

