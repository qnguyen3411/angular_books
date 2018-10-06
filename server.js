const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(express.static( __dirname + '/./public/dist/public' ));


app.listen(8000, () => {
  console.log("LISTENING AT PORT 8000");
})

mongoose.connect('mongodb://localhost/authors');
mongoose.Promise = global.Promise;

const isPast = (date) => {
  const now = new Date()
  return date < now;
}

const AuthorSchema = new mongoose.Schema({
  firstName: {type: String, required: true, minlength: 2},
  lastName: {type: String, required: true, minlength: 2},
  country: {type: String, required: true, minlength: 2},
  birthDate: { type: Date, required: true,
    validate:{
      validator : isPast,
      message: "Birthdate must be in the past"
    }
  },
  books: [{
    title: {type: String, required: true, minlength: 2},
    pubDate: { type: Date, required: true,
      validate:{
        validator : isPast,
        message: "pubDate must be in the past"
      }
    }
  }]
})

mongoose.model('Author', AuthorSchema)
const Author = mongoose.model('Author')

app.get('/authors', (req, res) => {
  Author.find().then(authors => {
    res.json({status: "success", results: authors})  
  }).catch(err => {
    res.json({status: "error", results: err.errors})
  })
})

app.get('/authors/:id', (req, res) => {
  Author.findById(req.params.id).then(author => {
    res.json({status: "success", results: author}) 
  }).catch(err => {
    res.json({status: "error", results: err.errors})
  })
})

app.post('/authors', (req, res) => {
  const author = new Author(req.body);
  author.save().then(author => {
    console.log(`DID IT ${author}`)
    res.json({status: "success", results: author})
  }).catch(err => {
    console.log(`AW SHIT ${err}`)
    res.json({status: "error", results: err.errors})
  })
})

app.post('/authors/:id', (req, res) => {
  const newBook = req.body
  Author.findByIdAndUpdate(
    req.params.id,
    {$push: {books: newBook}},
    {runValidators: true}
    ).then(result => {
      res.json({status: "success", results: result})
    }).catch(err => {
      res.json({status: "error", results: err.errors})
    })
})

app.put('/authors/:id', (req, res) => {
  Author.findByIdAndUpdate(
    req.params.id,
    req.body,
    {runValidators: true}
  ).then(result => {
    res.json({status: "success", results: result})
  }).catch(err => {
    res.json({status: "error", results: err.errors})
  })
})

app.delete('/books/:id', (req, res) => {
  Author.update(
    {},
    {$pull: {books: {_id: req.params.id}}}
  ).then(result => {
    res.json({status: "success", results: result})
  }).catch(err => {
    res.json({status: "error", results: err.errors})
  })
})

app.delete('/authors/:id', (req, res) => {
  Author.findByIdAndDelete(req.params.id)
  .then(result => {
    res.json({status: "success", results: result})
  }).catch(err => {
    res.json({status: "error", results: err.errors})
  })

})