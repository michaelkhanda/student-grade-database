const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3001;
const jsonParser = bodyParser.json();
const fileName = 'students.json';

// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (request, response) => {
    response.render('home');
});

// This is a RESTful GET web service to get all students
app.get('/students', (request, response) => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1);
    response.send(data);
});

// This is a RESTful POST web service to add a new student
app.post('/students', jsonParser, (request, response) => {
    data.push(request.body);
    console.log(request.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();
});

// This is a RESTful PUT web service to update an existing student
app.put('/students/:id', jsonParser, (request, response) => {
    const id = parseInt(request.params.id);
    const studentIndex = data.findIndex(student => student.id === id);
    if (studentIndex !== -1) {
        data[studentIndex] = request.body;
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        response.end();
    } else {
        response.status(404).send('Student not found');
    }
});

// This is a RESTful DELETE web service to delete an existing student
app.delete('/students/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const studentIndex = data.findIndex(student => student.id === id);
    if (studentIndex !== -1) {
        data.splice(studentIndex, 1);
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        response.end();
    } else {
        response.status(404).send('Student not found');
    }
});


app.listen(port);
console.log('server listening on port 3001');