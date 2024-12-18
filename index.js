const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.static("dist"));
app.use(express.json());

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))

let entries = [ 
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${entries.length} people</p><p>${new Date()}</p>`);
})

app.get("/api/persons", (request, response) => {
  response.json(entries);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const entry = entries.find((entry) => entry.id === id);

  if (entry) {
    response.json(entry);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
    const maxId = entries.length > 0 ? Math.max(...entries.map(n => Number(n.id))) : 0;
    return String(Math.random()*1000000)
}

app.post("/api/persons/", (request, response) => {
    const body = request.body

    if(!body.name || !body.number)
    {
       return response.status(400).json({error: "Both name and number are needed to add a new entry",});
    }

    if(entries.find(entry => entry.name === body.name))
    {
        return response.status(400).json({error: "The name already exists in the phonebook",});
    }

    const entry = {
        id: generateId(),
        name: body.name,
        number: body.number
    } 

    entries = entries.concat(entry);

    response.json(entry);
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  entries = entries.filter((entry) => entry.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
