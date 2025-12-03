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
    let uid = req.query.userid

    let redirect = false;
    if ( !uid ) {
        uid = uuidv4()
        users.push(uid)
        
        console.log(`User Experience Started: ${uid}`)

        redirect = true
    }

    if ( redirect ) {
        res.redirect(`/security/lostAndFound?userid=${uid}`)
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
    
    if ( !(users.includes(userid)) ) { //switch "includes" for "in" if we change to an object
        res.send(JSON.stringify(packet))
        return;
    }

    packet.status = 'success'
    packet.message = itemCatalog
    res.send(JSON.stringify(packet))
})
app.get("/security/request", function(req, res) {
    let uid = req.query.userid
    // ADD USER id validation

    res.sendFile(path.join(__dirname, "security", "request.html"))
})
app.get("/security/requestCatalog", function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    let userid = req.query.userid

    if ( !(users.includes(userid)) ) {
        res.send(JSON.stringify(packet))
        return;
    }

    packet.status = 'success'
    packet.message = requestCatalog
    res.send(JSON.stringify(packet))
})
app.post("/security/request", upload.single('photo'), function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    let userid = req.body.userid
    // if ( !(userid in users) ) {
    //     res.send(JSON.stringify(packet))
    //     return;
    // }

    // let user = users[userid]
    let contactName = req.body.contactName
    let contactEmail = req.body.contactEmail
    let description = req.body.description
    let estimatedDateLost = req.body.estimatedDateLost
    let additionalNotes = req.body.additionalNotes
    let objectType = req.body.objectType
    let photo = req.file.filename
    let item = [description, objectType, estimatedDateLost, additionalNotes, photo]
    let request = [[contactName, contactEmail], item]

    //Check issues in input
    requestCatalog.push(request)
    packet.status = 'success'
    packet.message = 'Request Submitted'
    res.send(JSON.stringify(packet))
})
app.get("/security/submit", function(req, res) {
    let userid = req.query.userid
    //ADD USER id validation
    
    res.sendFile(path.join(__dirname, "security", "submit.html"))
})
app.post("/security/submit", upload.single('photo'), function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    //Check issues in input
    let userid = req.query.userid
    let description = req.body.description
    let objectType = req.body.objectType
    let additionalNotes = req.body.additionalNotes
    let photo = req.file.filename
    let item = [description, objectType, additionalNotes, photo]
    
    itemCatalog.push(item)
    packet.status = 'success'
    packet.message = 'Item Submitted'
    res.redirect(`/security/lostAndFound?userid=${userid}`)
})
app.get("/security/authors", function(req, res) {
    let userid = req.query.userid
    //ADD USER id validation

    res.sendFile(path.join(__dirname, "security", "authors.html"))
})

app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`)
})