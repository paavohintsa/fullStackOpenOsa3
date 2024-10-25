const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('data', function getId (req) {
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
  })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('dist'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
  ]

const cors = require('cors')

app.use(cors())

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    const numPersons = persons.length
    const currentTime = new Date()   
  
    response.send(`
      <p>Phonebook has info for ${numPersons} people</p>
      <p>${currentTime}</p>
    `)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = persons.find(note => note.id === id)

    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
  })
  
  app.post('/api/person', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }

    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.random(10000),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })