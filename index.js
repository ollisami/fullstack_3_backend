require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const morganBody = require('morgan-body')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

morganBody(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(result => {
    res.json(result.map(person => person.toJSON()))
  }).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.find({}).then(result => {
        const totalText = `<p>Puhelinluettelossa ${result.length} henkilön tiedot</p>`
        const timeText  = `<p>${new Date()}</p>`
        res.send(totalText + timeText)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    }).catch(error => next(error))
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:number', (req, res, next) => {
    const body = req.body

    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
});

app.post('/api/persons', (req, res, next) => {
    const person = req.body
    let errorMsg;
    if (!person.name && !person.number) errorMsg = "Anna nimi ja numero"
    else if (!person.name) errorMsg = "Nimi puuttuu"
    else if (!person.number) errorMSG = "Numero puuttuu"

    if (errorMsg) {
        console.log("error in post: " + errorMsg)
        res.status(500).send({ error: errorMsg})
        return;
    }

    Person.findById(req.params.id)
    .then(p => {
      if (p) {
        res.status(500).send({ error: "Nimi on jo luettelossa"})
      } else {
        const p = new Person({
            name: person.name,
            number: person.number,
        })
        p.save().then(savedPerson => {
            res.json(savedPerson.toJSON())
        }).catch(error => next(error))
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})