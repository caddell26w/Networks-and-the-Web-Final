async function init() {
    let params = new URLSearchParams(window.location.search)

    let userid = params.get('userid') || -1
    
    document.getElementById('submitAnItem').href = `/security/submit?userid=${userid}`
    document.getElementById('submitARequest').href = `/security/request?userid=${userid}`
    document.getElementById('authors').href = `/security/authors?userid=${userid}`
    if (document.body.id === "indexPage") {
        let uri = `/security/itemCatalog?userid=${userid}`

        let itemCatalog = await fetch(uri)
        itemCatalog = await itemCatalog.json()
        itemCatalog = itemCatalog.message

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
            photo.textContent = item[3]
            itemContainer.appendChild(photo)
            
            let itemListContainer = document.getElementById('itemListContainer')
            itemListContainer.appendChild(itemContainer)
        }
    }
    document.addEventListener('click', screenClick);
    document.getElementById('menuButton').addEventListener('click', buttonClick);
    document.getElementById('closeMenuButton').addEventListener('click', buttonClick);
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

window.onload = init;