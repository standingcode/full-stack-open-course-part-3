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

app.get("/api/persons/:id", (request, response, next) => {
  return Person.findById({ _id: request.params.id })
    .then((person) => {
      if (person) {
        return response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
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
          .catch((error) => {
            console.log(error);
          });
      } else {
        const message = "The user to update was not found in the database";
        console.log(message);
        return response.status(404).json({ error: message });
      }
    })
    .catch((error) => {
      const message =
        "Failure attempting to get single person from the database";

      console.log(message);
      response.status(400).send({ error: error });
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
