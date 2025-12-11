const express = require("express")
const multer = require("multer")
const upload = multer({dest: __dirname + '/uploads/'})
const parser = require("body-parser")
const path = require("path")
const {v4: uuidv4} = require('uuid')

const itemCatalog = []
const requestCatalog = []

const users = []

const PORT = 8429
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "uploads")))

app.use(parser.json())

app.get("/security/lostAndFound", function(req, res) {
    let userid = req.query.userid

    let redirect = false;

    if ( !userid ) {
        userid = uuidv4()
        users.push(userid)
        
        console.log(`User Experience Started: ${userid}`)

        redirect = true
    }

    if ( redirect ) {
        res.redirect(`/security/lostAndFound?userid=${userid}`)
        return;
    }

    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }

    res.sendFile(path.join(__dirname, "security", "index2.html"))
});
app.get("/security/itemCatalog", function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    let userid = req.query.userid
    let searchBy = req.query.searchBy
    let parameterValue = req.query.parameterValue
    let parameters = ["description", "type", "additionalNotes"]
    let displayCatalog = []
    
    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }

    if (searchBy !== undefined && parameterValue !== undefined) {
        let itemIndex = parameters.indexOf(searchBy)
        if (itemIndex === 0 || itemIndex === 2) {
            for (let item of itemCatalog) {
                if (item[itemIndex].toLowerCase().includes(parameterValue.toLowerCase())) {
                    displayCatalog.push(item)
                }
            }
        }
        else if (itemIndex === 1) {
            for (let item of itemCatalog) {
                if (item[itemIndex] === parameterValue) {
                    displayCatalog.push(item)
                }
            }
        }
    }
    else {
        displayCatalog = itemCatalog
    }

    packet.status = 'success'
    packet.message = displayCatalog
    res.send(JSON.stringify(packet))
})
app.get("/security/request", function(req, res) {
    let userid = req.query.userid
    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }

    res.sendFile(path.join(__dirname, "security", "request.html"))
})
app.get("/security/requestCatalog", function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    let userid = req.query.userid

    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }

    packet.status = 'success'
    packet.message = requestCatalog
    
    res.send(JSON.stringify(packet))
})
app.get("/security/requestCatalogPage", function(req, res) {
    let userid = req.query.userid
    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }

    res.sendFile(path.join(__dirname, "security", "requestCatalog.html"))
})
app.post("/security/request", upload.single('photo'), function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    let userid = req.query.userid
    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }

    let contactName = req.body.contactName
    let contactEmail = req.body.contactEmail
    let description = req.body.description
    let estimatedDateLost = req.body.estimatedDateLost
    let additionalNotes = req.body.additionalNotes
    let objectType = req.body.objectType
    let photo = req.file.filename
    let mimetype = req.file.mimetype
    if (mimetype != "image/png" || mimetype != "image/jpeg" || mimetype != "image/jpg") {
        res.redirect(`/security/request?userid=${userid}`)
        return;
    }
    let item = [description, objectType, estimatedDateLost, additionalNotes, photo]
    let request = [[contactName, contactEmail], item]

    //Check issues in input
    requestCatalog.push(request)
    packet.status = 'success'
    packet.message = 'Request Submitted'
    res.redirect(`/security/requestCatalogPage?userid=${userid}`)
})
app.get("/security/submit", function(req, res) {
    let userid = req.query.userid
    console.log(users)
    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }
    
    res.sendFile(path.join(__dirname, "security", "submit.html"))
})
app.post("/security/submit", upload.single('photo'), function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    //Check issues in input
    let userid = req.query.userid
    if ( !(users.includes(userid)) ) { // Invalid User ID
        res.redirect(`/security/error`)
        return;
    }
    let description = req.body.description
    let objectType = req.body.objectType
    let additionalNotes = req.body.additionalNotes
    let photo = req.file.filename
    let mimetype = req.file.mimetype
    if (mimetype != "image/png" || mimetype != "image/jpeg" || mimetype != "image/jpg") {
        res.redirect(`/security/submit?userid=${userid}`)
        return;
    }
    let item = [description, objectType, additionalNotes, photo]
    
    itemCatalog.push(item)
    packet.status = 'success'
    packet.message = 'Item Submitted'
    res.redirect(`/security/lostAndFound?userid=${userid}`)
})
app.get("/security/authors", function(req, res) {
    let userid = req.query.userid
    if ( !(users.includes(userid)) ) {
        res.redirect(`/security/error`)
        return;
    }

    res.sendFile(path.join(__dirname, "security", "authors.html"))
})
app.get("/security/error", function(req, res) {
    res.sendFile(path.join(__dirname, "security", "error.html"))
})

app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`)
})