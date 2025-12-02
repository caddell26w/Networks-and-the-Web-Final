const express = require("express")
const parser = require("body-parser")
const path = require("path")
const {v4: uuidv4} = require('uuid')

const itemCatalog = [[1,3,4, 5], [4,34, 5, 10], [4, 5, 2, 4], [0, 3, 4, 5]]
const requestCatalog = []

const users = {}

const PORT = 8429
const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(parser.json())

app.get("/security/lostAndFound", function(req, res) {
    let uid = req.query.userid

    let redirect = false;
    if ( !uid ) {
        uid = uuidv4()
        
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
    // let userid = req.query.userid
    // if ( !(userid in users) ) {
    //     res.send(JSON.stringify(packet))
    //     return;
    // }

    packet.status = 'success'
    packet.message = itemCatalog
    res.send(JSON.stringify(packet))
})
app.post("/security/request", function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User ID'
    }
    let userid = req.body.userid
    if ( !(userid in users) ) {
        res.send(JSON.stringify(packet))
        return;
    }

    let user = users[userid]
    let description = req.body.description
    let contactName = req.body.contactName
    let contactEmail = req.body.contactEmail
    let estimatedDateLost = req.body.estimatedDateLost
    let objectType = req.body.objectType
    let photo = req.body.photo
    let item = [description, objectType, estimatedDateLost, additionalNotes, photo]
    let request = [[contactName, contactEmail], item]

    //Check issues in input
    requestCatalog.push(request)
    packet.status = 'success'
    packet.message = 'Request Submitted'
    res.send(JSON.stringify(packet))
})

app.post("/security/submit", function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User'
    }
    //Check issues in input
    let description = req.body.description
    let objectType = req.body.objectType
    let additionalNotes = req.body.additionalNotes
    let photo = req.body.photo
    let item = [description, objectType, additionalNotes, photo]

    itemCatalog.push(item)
    packet.status = 'success'
    packet.message = 'Item Submitted'
    res.send(JSON.stringify(packet))
})

app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`)
})