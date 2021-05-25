const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const URL = `mongodb+srv://fullstack:${password}@cluster0.89jxe.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
  return
}

const newName = process.argv[3]
const newNumber = process.argv[4]

const person = new Person({
  name: newName,
  number: newNumber,
})

person.save().then(() => {
  console.log(`added ${newName} number ${newNumber} to phonebook`)
  mongoose.connection.close()
})
