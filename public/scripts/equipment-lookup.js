// Import the data for the json file and store in an array
const equipmentArray = []; 

function handleError(err) {
    console.log(err);
}

async function getData() {
    const rawData = await fetch("../data/medical-devices-data.json").catch(handleError);
    const jsonData = await rawData.json();
    equipmentArray.push(...jsonData.medicalDevices)
    await initialiseEquipmentFields(equipmentArray);
}

getData();

const menuOpenArray = [false, false, false, false, false, false, false, false, false]; 

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

// Elements for containing the submenus
const sub1 = document.querySelector('.sub1');
const sub2 = document.querySelector('.sub2');
const sub3 = document.querySelector('.sub3');
const sub4 = document.querySelector('.sub4');
const sub5 = document.querySelector('.sub5');
const sub6 = document.querySelector('.sub6');
const sub7 = document.querySelector('.sub7');
const sub8 = document.querySelector('.sub8');
const sub9 = document.querySelector('.sub9');

// Submenus array
const subMenuArray = [sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9];

// Event listeners for each menu option
menuOptions.forEach((option) => {
    option.addEventListener('click', openMenu);
    option.addEventListener('mouseover', highlightMenu);
    option.addEventListener('mouseout', removeHighlight);
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

// Define the submenus for each menu category
const subMenus = {
    sub1: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"], ['placeholder4',"../html/test.html"]],
    sub2: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"], ['placeholder4',"../html/test.html"]],
    sub3: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"], ['placeholder4',"../html/test.html"]],
    sub4: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"]],
    sub5: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"], ['placeholder4',"../html/test.html"]],
    sub6: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"]],
    sub7: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"]],
    sub8: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"], ['placeholder3',"../html/test.html"], ['placeholder4',"../html/test.html"]],
    sub9: [['placeholder1',"../html/test.html"], ['placeholder2',"../html/test.html"]]
}

// Create submenu html output
function outputSubMenu(sub) {
    const subArray = subMenus[sub];
    return subArray.map(element => {
        return `<div class="sub-menu"><div class="space"></div><a class="sub-text" href=${element[1]}>${element[0]}</a></div>`
    }).join('');
}

// Adjust the sidebar menu for when options are clicked
function openSubMenu(element) {
    menuOptions.forEach((option) => {
        option.children[1].setAttribute('class', `arrow`);
        option.setAttribute('class', 'category');
    })

    subMenuArray.forEach(menu => {
        menu.innerHTML = '';
    })
    
    // If statements based on which sidebar menu option is selected. 
    // The arrow is changed and the submenu is displayed.
    if (element.firstElementChild.firstElementChild.classList.contains('admin')) {
        menuOpenArray[0] = !menuOpenArray[0];
        const menuOpen = menuOpenArray[0];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub1.innerHTML = outputSubMenu('sub1');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub1.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('technical')) {
        menuOpenArray[1] = !menuOpenArray[1];
        const menuOpen = menuOpenArray[1];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub2.innerHTML = outputSubMenu('sub2');;
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub2.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('contacts')) {
        menuOpenArray[2] = !menuOpenArray[2];
        const menuOpen = menuOpenArray[2];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub3.innerHTML = outputSubMenu('sub3');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub3.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('database')) {
        menuOpenArray[3] = !menuOpenArray[3];
        const menuOpen = menuOpenArray[3];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub4.innerHTML = outputSubMenu('sub4');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub4.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('alerts')) {
        menuOpenArray[4] = !menuOpenArray[4];
        const menuOpen = menuOpenArray[4];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub5.innerHTML = outputSubMenu('sub5');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub5.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('training')) {
        menuOpenArray[5] = !menuOpenArray[5];
        const menuOpen = menuOpenArray[5];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub6.innerHTML = outputSubMenu('sub6');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub6.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('ohs')) {
        menuOpenArray[6] = !menuOpenArray[6];
        const menuOpen = menuOpenArray[6];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked'); 
            element.classList.add('menuHighlight');
            sub7.innerHTML = outputSubMenu('sub7');
        }
        else {
            element.querySelector(':last-child').setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub7.innerHTML = '';
        }
    }
    else if (element.firstElementChild.firstElementChild.classList.contains('procurement')) {
        menuOpenArray[7] = !menuOpenArray[7];
        const menuOpen = menuOpenArray[7];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked');
            element.classList.add('menuHighlight'); 
            sub8.innerHTML = outputSubMenu('sub8');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub8.innerHTML = '';
        }
    }
    else {
        menuOpenArray[8] = !menuOpenArray[8];
        const menuOpen = menuOpenArray[8];
        if (menuOpen == true) { 
            element.children[1].classList.add('menu-clicked');
            element.classList.add('menuHighlight');
            sub9.innerHTML = outputSubMenu('sub9');
        }
        else {
            element.children[1].setAttribute('class', 'arrow');
            element.classList.add('menuHighlight');
            sub9.innerHTML = '';
        }
    }
}

function highlightMenu() {
    this.classList.add('menuHighlight');
    this.querySelector('.arrow').style.transform = 'translateX(-10px)';
}

function removeHighlight() {
    const menuOptionsArray = Array.from(menuOptions);
    const index = menuOptionsArray.indexOf(this);
    if (!menuOpenArray[index]) {
        this.classList.remove('menuHighlight');
        this.querySelector('.arrow').style.transform = 'translateX(0px)';
    }
}

function openMenu() {
 openSubMenu(this);
}

