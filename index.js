const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    },
]

function getObjectById(id){
    let obj = null;

    persons.forEach((person) => {
        if(person.id == id){
            obj = person
        }
    })

    return obj
}

function getRandomId(){
    const id = Math.floor(Math.random() * 1000)
    
    return id.toString()
}

function validateContact(obj){
    let bool = true

    if(obj.name === null || obj.number === null){
        bool = false
    }
    else if(obj.name === "" || obj.number === ""){
        bool = false
    }
    else if(obj.name === undefined || obj.number === undefined){
        bool = false
    }
    else if(obj.name === NaN || obj.number === NaN){
        bool = false
    }
    
    persons.forEach((person) => {
        if(person.name === obj.name){
            bool =  false
        }
    })

    return bool
}


app.get('/api/persons', (req, res) => {
    res.status(200).json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    let id = req.params.id

    let person = getObjectById(id)

    if(person == null){
        res.status(404).send(`<p>Error! Contact with ID ${id}, was not found.</p>`)
    }else {
        res.status(200).json(person)
    }
})

app.post('/api/persons/', (req, res) => {
    let obj = req.body
    
    let validation = validateContact(obj)
    
    if(validation){
        obj.id = getRandomId()
        persons.push(obj)

        res.status(200).json(persons)
    }
    else {
        res.status(400).send('Error! Contact already exists!')
    }
})

app.delete('/api/persons/:id', (req, res) => {
    let id = req.params.id
    
    persons = persons.filter(person => person.id !== id)

    // Timeout set for a delayed response, so that list filter is finished before sending response.
    setTimeout(() => {
        console.log('Removing contact..')
    }, 500)

    res.status(200).json(persons)
})

app.get('/info', (req, res) => {
    let date = new Date(Date.now()).toString()
    let count = persons.length

    res.status(200).send(`<p>Phonebook has info for ${count} people.<br /><br /> ${date}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})