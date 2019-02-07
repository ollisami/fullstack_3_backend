const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const env_name = process.argv[3]
const env_number = process.argv[4]
const url =
  `mongodb://fullstack:${password}@ds223605.mlab.com:23605/fullstack_persons`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: env_name,
  number: env_number
})

if (env_name && env_number) {
person.save().then(response => {
  console.log(`lisätään ${env_name} numero ${env_number} luetteloon`);
  mongoose.connection.close();
})
} else {
    Person.find({}).then(result => {
        console.log('Puhelinluettelo:')
        result.forEach(person => {
        console.log(`${person.name}  ${person.number}`)
        })
        mongoose.connection.close()
    })
}