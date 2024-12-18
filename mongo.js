const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as an argument");
  process.exit(1);
}

// Just testing push to source control, delete later

const password = process.argv[2];

const url = `mongodb+srv://phonebook-read-write:${password}@cluster0.vngt9eu.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  Person.find({})
    .then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
      mongoose.connection.close();
      process.exit(1);
    })
    .catch((error) => {
      process.exit(1);
    });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log("person saved!");
    console.log(result);
    mongoose.connection.close();
  });
}
