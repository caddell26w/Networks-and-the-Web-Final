const express = require("express")
const parser = require("body-parser")
const path = require("path")
const {v4: uuidv4} = require('uuid')

const PORT = 8429
const app = express();
app.use("/static", express.static(path.join(__dirname, "public")))
app.use(parser.json())

app.get("/lostAndFound", function(req, res) {
    console.log("ACTIVATED")
    res.sendFile(path.join(__dirname, "security", "index2.html"))
});
app.post("security/request", function(req, res) {
    const packet = {
        status: 'error',
        message: 'Invalid User'
    }

    let description = req.body.description
    let contactName = req.body.contactName
    let contactEmail = req.body.contactEmail
    let estimatedDateLost = req.body.estimatedDateLost
    let objectType = req.body.objectType
    let photo = req.body.photo

    //Check issues in input
    packet.status = 'success'
    packet.message = 'Request Submitted'
})

app.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`)
    console.log(path.join(__dirname, "security", "index2.html"))
})