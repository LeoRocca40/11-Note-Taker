const express = require('express');
const path = require('path');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Get home
app.get('/', (req, res) => res.send('/public/index.html'));

// get notes
app.get('/notes', (req, res) => { 
    res.sendFile(path.join(__dirname, '/public/notes.html'));
 });

app.get('/api/notes', (req, res) =>
 fs.readFile('db/db.json', 'utf8', (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data))
 })
);

// request to create new note
app.post('/api/notes', (req, res) => {
    var title = req.body.title
    var text = req.body.text
    var newNote = {title, text, id:uuidv4()} 

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        var currentNote = JSON.parse(data)
        currentNote.push(newNote)
        fs.writeFile('db/db.json', JSON.stringify(currentNote), (err) => {
            err ? console.log(err) : console.log(newNote.title + ' has been saved') 
        })
        res.sendFile(path.join(__dirname, 'public/notes.html'));
    })
})

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
