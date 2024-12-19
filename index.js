require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
// app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

app.get("/info", (request, response) => {
  Person.find({})
    .then((people) => {
      people.forEach((person) => {
        console.log(person);
      });
      response.send(
        `<p>Phonebook has info for ${
          people.length
        } people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => {
      console.log(error);
      response.send("Could not count the users");
    });
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((people) => {
      people.forEach((person) => {
        console.log(person);
      });

      response.json(people);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/persons/:id", (request, response) => {
  return Person.findById(request.params.id)
    .then((person) => {
      console.log(person.name);
      return response.json(person);
    })
    .catch((error) => {
      return response.status(404).end();
    });
});

app.put("/api/persons/:id", (request, response) => {
  console.log(request.body);
  const body = request.body;

  if (!body.number) {
    return response
      .status(400)
      .json({ error: "Number is needed to update an entry" });
  }

  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        person.number = body.number;

        person
          .save()
          .then((person) => {
            response.json(person);
          })
          .catch((error) => {});
      } else {
        console.log("The updated user could not be saved");
        return response
          .status(400)
          .json({ error: "The updated user could not be saved" });
      }
    })
    .catch((error) => {
      console.log("Could not get person by id");
      return response
        .status(400)
        .json({ error: "A current user could not be found with this id" });
    });
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "Both name and number are needed to add a new entry" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      console.log("Could not save new person");
      return response.status(400).json({ error: "Could not save new person" });
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.deleteOne({ _id: request.params.id })
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      response.status(204).end();
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
