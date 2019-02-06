const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const morganBody = require('morgan-body')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

//Cheating = Winning
morganBody(app);

let persons = [
    {
        id: 1,
        name: "Lea Kutvonen",
        number: "040-123456",
    },
    {
        id: 2,
        name: "testi testaaja",
        number: "098765432",
    },
    {
        id: 3,
        name: "Test test",
        number: "1234",
    },
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    const totalText = `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>`
    const timeText  = `<p>${new Date()}</p>`
    res.send(totalText + timeText)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    let person = persons.find(person => person.id === id)
    if(person) {
        res.send(person)
    } else {
        console.log(`Henkilöä ${id} ei löydy`)
        res.status(404).end()
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    let person = persons.find(person => person.id === id)
    if(person) {
        persons = persons.filter(
            p => p.id !== person.id
        )
        console.log(`Numero ${id} poistettu`)
        res.status(204).send()
    } else {
        console.log(`Henkilöä ${id} ei löydy`)
        res.status(404).end()
    }
});

app.delete('/api/persons/:number', (req, res) => {
    const number = req.params.number
    let person = persons.find(person => person.number === number)
    if(person) {
        person.number = ``
        console.log(`Numero ${number} poistettu`)
        res.status(204).send()
    } else {
        console.log(`Numeroa ${number} ei löydy`)
        res.status(404).send(`Numeroa ${number} ei löydy`)
    }
});

app.post('/api/persons', (req, res) => {
    const newId  = Math.floor(Math.random() * 1000000)
    const person = req.body
    let errorMsg;
    if (!person.name && !person.number) errorMsg = "Anna nimi ja numero"
    else if(!person.name) errorMsg = "Nimi puuttuu"
    else if(!person.number) errorMSG = "Numero puuttuu"
    else if(persons.find(p => (p.name === person.name))) errorMsg = "Nimi on jo luettelossa"

    if(errorMsg) {
        console.log("error in post: " + errorMsg)
        res.status(500).send({ error: errorMsg})

    } else {
        person.id = newId 
        persons = persons.concat(person)
        res.json(person)
    }
    console.log( JSON.stringify(res.json()))
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})