let params = new URLSearchParams(window.location.search)

let userid = params.get('userid') || -1

async function init() {
    if (document.body.id !== "errorPage") {
        if (document.body.id !== "indexPage") {
            document.getElementById('itemCatalog').href = `/security/lostAndFound?userid=${userid}`
        }
        if (document.body.id !== "submitPage") {
            document.getElementById('submitAnItem').href = `/security/submit?userid=${userid}`
        }
        if (document.body.id !== "requestPage") {
            document.getElementById('submitARequest').href = `/security/request?userid=${userid}`
        }
        if (document.body.id !== "authorsPage") {
            document.getElementById('authors').href = `/security/authors?userid=${userid}`
        }
        if (document.body.id !== "requestCatalogPage") {
            document.getElementById('getRequestCatalog').href = `/security/requestCatalogPage?userid=${userid}`
        }
        if (document.body.id === "indexPage") {
            document.getElementById('searchBy').addEventListener('change', searchByChanged)
            
            let uri = `/security/itemCatalog?userid=${userid}`

            dynamicItemCatalog(uri)
        }
        else if (document.body.id === "requestPage") {
            document.getElementById('requestForm').action = `/security/request?userid=${userid}`
        }
        else if (document.body.id === "submitPage") {
            document.getElementById('submitForm').action = `/security/submit?userid=${userid}`
        }
        else if (document.body.id === "requestCatalogPage") {
            let uri = `/security/requestCatalog?userid=${userid}`

            let reqCatalog = await fetch(uri)
            reqCatalog = await reqCatalog.json()
            reqCatalog = reqCatalog.message

            if (reqCatalog === 'Invalid User ID') { //Handle an invalid session
                return;
            }
            else {
                for (let request of reqCatalog) {
                    let contact = request[0];
                    let item = request[1];

                    let itemContainer = document.createElement('div')
                    itemContainer.classList.add('itemContainer')
                    
                    let contactName = document.createElement('div');
                    contactName.classList.add('item', 'contactName');
                    contactName.textContent = contact[0];
                    itemContainer.appendChild(contactName);

                    let contactEmail = document.createElement('div');
                    contactEmail.classList.add('item', 'contactEmail');
                    contactEmail.textContent = contact[1];
                    itemContainer.appendChild(contactEmail);

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

                    let estimatedDateLost = document.createElement('div')
                    estimatedDateLost.classList.add('item', 'estimatedDateLost')
                    let date = item[2].split("-")
                    date = `${date[1]}/${date[2]}/${date[0]}`
                    estimatedDateLost.textContent = date
                    itemContainer.appendChild(estimatedDateLost)

                    let additionalNotes = document.createElement('div')
                    additionalNotes.classList.add('item', 'additionalNotes')
                    additionalNotes.textContent = item[3]
                    itemContainer.appendChild(additionalNotes)

                    let photo = document.createElement('div')
                    photo.classList.add('item', 'photo')
                    let fileStatus = await checkFile(`/images/${item[4]}`)
                    if (item[4] === "" || fileStatus === 404) {
                        photo.textContent = "No photo"
                    }
                    else if (fileStatus === "Error while trying to load...") {
                        photo.textContent = fileStatus
                    }
                    else {
                        let image = document.createElement('img')
                        image.classList.add('catalogImage')
                        image.src = `/images/${item[4]}`
                        photo.appendChild(image)
                    }
                    itemContainer.appendChild(photo)
                
                    let itemListContainer = document.getElementById('itemListContainer')
                    itemListContainer.appendChild(itemContainer)
                }
            }
        }

        document.addEventListener('click', screenClick);
        document.getElementById('menuButton').addEventListener('click', buttonClick);
        document.getElementById('closeMenuButton').addEventListener('click', buttonClick);
    }
}

async function checkFile(uri) {
    try {
        const response = await fetch(uri, {method: 'HEAD'})
        return response.status
    }
    catch {
        return "Error while trying to load..."
    }
}

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

function buttonClick(event) {
    let button = event.target;
    let button2 = document.getElementById('menuButton');
    if (button === button2) {
        button2 = document.getElementById('closeMenuButton');
    }
    let dialogBox = document.getElementById(button.getAttribute('aria-controls'))
    if (button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded', false);
        button2.setAttribute('aria-expanded', false);
        dialogBox.style.display = 'none';
    }
    else {
        button.setAttribute('aria-expanded', true);
        button2.setAttribute('aria-expanded', true);
        dialogBox.style.display = 'block';
    }
}

async function dynamicItemCatalog(uri) {
    let itemListContainer = document.getElementById('itemListContainer')
    while (itemListContainer.children.length > 1) {
        itemListContainer.removeChild(itemListContainer.lastChild)
    }

    let itemCatalog = await fetch(uri)
    itemCatalog = await itemCatalog.json()
    itemCatalog = itemCatalog.message

    if (itemCatalog === 'Invalid User ID') { //Handle an invalid session
        return;
    }
    else {
        for (let item of itemCatalog) {
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

function searchByChanged(event) {
    let searchBy = event.target
    let parameter = searchBy.value
    document.getElementById(`${parameter}SearchBy`).addEventListener('input', parameterChange)
    let descriptionContainer = document.getElementById('descriptionSearchContainer')
    let typeContainer = document.getElementById('typeSearchContainer')
    // let statusContainer = document.getElementById('statusSearchContainer')
    let additionalNotesContainer = document.getElementById('additionalNotesSearchContainer')
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

async function parameterChange(event) {
    let parameterElement = event.target
    let parameterValue = parameterElement.value
    let parameter = parameterElement.id
    parameter = parameter.replace("SearchBy", "")
    
    if (parameterValue !== "" && parameterValue !== "None") {
        let uri = `/security/itemCatalog?userid=${userid}&searchBy=${parameter}&parameterValue=${parameterValue}`
        dynamicItemCatalog(uri)
    }
    else {
        let uri = `/security/itemCatalog?userid=${userid}`
        dynamicItemCatalog(uri)
    }
}

window.onload = init;