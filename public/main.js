let params = new URLSearchParams(window.location.search)

let userid = params.get('userid') || -1

async function init() {
    if (document.body.id !== "errorPage") {
        if (document.body.id !== "indexPage") {
            // Adds userid to anchor for the request to index2.html in the dialogBox
            document.getElementById('itemCatalog').href = `/security/lostAndFound?userid=${userid}`
        }
        if (document.body.id !== "submitPage") {
            // Adds userid to anchor for the request to submit.html in the dialogBox
            document.getElementById('submitAnItem').href = `/security/submit?userid=${userid}`
        }
        if (document.body.id !== "requestPage") {
            // Adds userid to anchor for the request to request.html in the dialogBox
            document.getElementById('submitARequest').href = `/security/request?userid=${userid}`
        }
        if (document.body.id !== "authorsPage") {
            // Adds userid to anchor for the request to author.html in the dialogBox
            document.getElementById('authors').href = `/security/authors?userid=${userid}`
        }
        if (document.body.id !== "requestCatalogPage") {
            // Adds userid to anchor for the request to requestCatalog.html in the dialogBox
            document.getElementById('getRequestCatalog').href = `/security/requestCatalogPage?userid=${userid}`
        }
        // Code for only the indexPage
        if (document.body.id === "indexPage") {
            // Adds eventListener to the (search by) select on index2.html
            document.getElementById('searchBy').addEventListener('change', searchByChanged)
            
            let uri = `/security/itemCatalog?userid=${userid}`

            dynamicItemCatalog(uri)
        }
        // Code for only the requestPage
        else if (document.body.id === "requestPage") {
            // Adds userid to the action on the requestPage form
            document.getElementById('requestForm').action = `/security/request?userid=${userid}`
        }
        // Code for only the submitPage
        else if (document.body.id === "submitPage") {
            // Adds userid to the action on the submitPage form
            document.getElementById('submitForm').action = `/security/submit?userid=${userid}`
        }
        // Code for only the requestCatalogPage
        else if (document.body.id === "requestCatalogPage") {
            let uri = `/security/requestCatalog?userid=${userid}`

            let reqCatalog = await fetch(uri)
            reqCatalog = await reqCatalog.json()
            reqCatalog = reqCatalog.message

            if (reqCatalog === 'Invalid User ID') { // Handles an invalid session
                return;
            }
            else { // Creates the request catalog
                for (let request of reqCatalog) {
                    let contact = request[0];
                    let item = request[1];

                    // Creates the itemContainer and adds it to the itemContainer class
                    let itemContainer = document.createElement('div')
                    itemContainer.classList.add('itemContainer')
                    
                    // Creates the contactName and adds it to the item and contactName classes
                    let contactName = document.createElement('div');
                    contactName.classList.add('item', 'contactName');
                    contactName.textContent = contact[0];
                    itemContainer.appendChild(contactName);

                    // Creates the contactEmail and adds it to the item and contactEmail classes
                    let contactEmail = document.createElement('div');
                    contactEmail.classList.add('item', 'contactEmail');
                    contactEmail.textContent = contact[1];
                    itemContainer.appendChild(contactEmail);

                    // Creates the description and adds it to the item and description classes
                    let description = document.createElement('div')
                    description.classList.add('item', 'description')
                    description.textContent = item[0]
                    itemContainer.appendChild(description)

                    // Creates the objectType and adds it to the item and type classes
                    let objectType = document.createElement('div')
                    objectType.classList.add('item', 'type')
                    objectType.textContent = item[1]
                    itemContainer.appendChild(objectType)

                    // Creates the status and adds it to the item and status classes
                    let status = document.createElement('div')
                    status.classList.add('item', 'status')
                    status.innerHTML = "Returned: --/--/--<br>Claimed: --/--/--"
                    itemContainer.appendChild(status)

                    // Creates the estimatedLost and adds it to the item and estimatedDateLost classes
                    let estimatedDateLost = document.createElement('div')
                    estimatedDateLost.classList.add('item', 'estimatedDateLost')
                    let date = item[2].split("-")
                    // Formatting the date input as an actual date
                    date = `${date[1]}/${date[2]}/${date[0]}`
                    estimatedDateLost.textContent = date
                    itemContainer.appendChild(estimatedDateLost)

                    // Creates the additionalNotes and adds it to the item and additionalNotes classes
                    let additionalNotes = document.createElement('div')
                    additionalNotes.classList.add('item', 'additionalNotes')
                    additionalNotes.textContent = item[3]
                    itemContainer.appendChild(additionalNotes)

                    // Creates the photo and adds it to the item and photo classes
                    let photo = document.createElement('div')
                    photo.classList.add('item', 'photo')
                    let fileStatus = await checkFile(`/images/${item[4]}`)
                    // Checks if the file exists
                    if (item[4] === "" || fileStatus === 404) {
                        photo.textContent = "No photo"
                    }
                    else if (fileStatus === "Error while trying to load...") {
                        photo.textContent = fileStatus
                    }
                    else {
                        // Creates the image if the file does exist
                        let image = document.createElement('img')
                        image.classList.add('catalogImage')
                        image.src = `/images/${item[4]}`
                        photo.appendChild(image)
                    }
                    itemContainer.appendChild(photo)
                
                    // Get the itemListContainer and adds the item to the list
                    let itemListContainer = document.getElementById('itemListContainer')
                    itemListContainer.appendChild(itemContainer)
                }
            }
        }

        // Adds eventListener for the a click on the screen (For dialogBox)
        document.addEventListener('click', screenClick);
        // Adds eventListeners for the buttons to both open and close the dialogBox
        document.getElementById('menuButton').addEventListener('click', buttonClick);
        document.getElementById('closeMenuButton').addEventListener('click', buttonClick);
    }
}
/**
 * Checks the headers of a file to see if it exists on the server
 * 
 * @param {String} uri the userid of the current user's session
 * @returns {String} the response from the fetch for the file's headers, which indicate if it exists or not
 */
async function checkFile(uri) {
    try {
        const response = await fetch(uri, {method: 'HEAD'})
        return response.status
    }
    catch {
        return "Error while trying to load..."
    }
}

/**
 * Runs only when a click is detected on the screen
 * 
 * Checks if the dialogBox is open and the screenClick was beyond the dialogBox before closing it
 * 
 * @param {Event} event the click event that occurs on the screen
 */
function screenClick(event) {
    let menuButton = document.getElementById('menuButton');
    let closeMenuButton = document.getElementById('closeMenuButton');
    if (menuButton.getAttribute('aria-expanded') === 'true') {
        let dialogBox = document.getElementById('dialogBox');
        if (event.pageX > dialogBox.offsetWidth) {
            dialogBox.style.display = 'none';
            menuButton.setAttribute('aria-expanded', false)
            closeMenuButton.setAttribute('aria-expanded', false)
            menuButton.style.display = 'block';
        }
    }
}

/**
 * Runs after a click is detected on a button
 * 
 * Updates all values and displays/hides the dialogBox based on what button was pressed
 * 
 * @param {Event} event the click event that occurs on the buttons
 */
function buttonClick(event) {
    let button = event.target;
    let button2 = document.getElementById('menuButton');
    if (button === button2) {
        button2 = document.getElementById('closeMenuButton');
    }
    let dialogBox = document.getElementById(button.getAttribute('aria-controls'))
    // Hides the dialogBox
    if (button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded', false);
        button2.setAttribute('aria-expanded', false);
        dialogBox.style.display = 'none';
    }
    //Displays the dialogBox
    else {
        button.setAttribute('aria-expanded', true);
        button2.setAttribute('aria-expanded', true);
        dialogBox.style.display = 'block';
    }
}

/**
 * Creates the itemCatalog from the data stored on the server
 * 
 * @param {String} uri the userid of the current user's session
 * @returns "", if the userid is invalid
 */
async function dynamicItemCatalog(uri) {
    let itemListContainer = document.getElementById('itemListContainer')
    // Removes all previous children
    while (itemListContainer.children.length > 1) {
        itemListContainer.removeChild(itemListContainer.lastChild)
    }

    //Fetches the itemCatalog and decodes it into data
    let itemCatalog = await fetch(uri)
    itemCatalog = await itemCatalog.json()
    itemCatalog = itemCatalog.message

    if (itemCatalog === 'Invalid User ID') { //Handles an invalid session
        return;
    }
    else {
        for (let item of itemCatalog) {
            // Dynamic Creation of elements very similar to requestCatalog with a bit less information
            let itemContainer = document.createElement('div')
            itemContainer.classList.add('itemContainer')

            let description = document.createElement('div')
            description.classList.add('item', 'description')
            description.textContent = item[0]
            itemContainer.appendChild(description)

            let objectType = document.createElement('div')
            objectType.classList.add('item', 'type')
            objectType.textContent = item[1]
            itemContainer.appendChild(objectType)

            let status = document.createElement('div')
            status.classList.add('item', 'status')
            status.innerHTML = "Returned: --/--/--<br>Claimed: --/--/--"
            itemContainer.appendChild(status)

            let additionalNotes = document.createElement('div')
            additionalNotes.classList.add('item', 'additionalNotes')
            additionalNotes.textContent = item[2]
            itemContainer.appendChild(additionalNotes)

            let photo = document.createElement('div')
            photo.classList.add('item', 'photo')
            let fileStatus = await checkFile(`/images/${item[3]}`)
            if (item[3] === "" || fileStatus === 404) {
                photo.textContent = "No photo"
            }
            else if (fileStatus === "Error while trying to load...") {
                photo.textContent = fileStatus
            }
            else {
                let image = document.createElement('img')
                image.classList.add('catalogImage')
                image.src = `/images/${item[3]}`
                photo.appendChild(image)
            }
            itemContainer.appendChild(photo)
            
            itemListContainer.appendChild(itemContainer)
        }
    }
}

/**
 * Displays the associated searchBy parameter when the value is changed
 * 
 * @param {Event} event the change event that occured on the searchBy element
 */
function searchByChanged(event) {
    let searchBy = event.target
    let parameter = searchBy.value
    // Adds a inputListener for the specific searchBy parameter
    document.getElementById(`${parameter}SearchBy`).addEventListener('input', parameterChange)
    let descriptionContainer = document.getElementById('descriptionSearchContainer')
    let typeContainer = document.getElementById('typeSearchContainer')
    // Future Implementation: let statusContainer = document.getElementById('statusSearchContainer')
    let additionalNotesContainer = document.getElementById('additionalNotesSearchContainer')
    // Hides all containers before showing the proper one
    for (let container of [descriptionContainer, typeContainer, additionalNotesContainer]) {
        container.style.display = 'none'
    }
    if (parameter === 'description') {
        descriptionContainer.style.display = 'flex'
    }
    else if (parameter === 'type') {
        typeContainer.style.display = 'flex'
    }
    else if (parameter === 'status') {
        statusContainer.style.display = 'flex'
    }
    else if (parameter === 'additionalNotes') {
        additionalNotesContainer.style.display = 'flex'
    }
}

/**
 * Searches the list as the value of the parameter changes and updates it in real-time
 * 
 * @param {Event} event the input event that occured on the parameterElement
 */
async function parameterChange(event) {
    let parameterElement = event.target
    let parameterValue = parameterElement.value
    let parameter = parameterElement.id
    parameter = parameter.replace("SearchBy", "")
    
    if (parameterValue !== "" && parameterValue !== "None") {
        // Shows the itemCatalog sorted by the current value of the parameter
        let uri = `/security/itemCatalog?userid=${userid}&searchBy=${parameter}&parameterValue=${parameterValue}`
        dynamicItemCatalog(uri)
    }
    else {
        // Displays the normal itemCatalog
        let uri = `/security/itemCatalog?userid=${userid}`
        dynamicItemCatalog(uri)
    }
}

window.onload = init;