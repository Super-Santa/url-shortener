const express = require('express')
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')
const ShortURL = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

app.get('/', async (req, res) => {
    const shortUrls = await ShortURL.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
   const shortUrl = await ShortURL.findOne({ short: req.params.shortUrl }) 

   if (shortUrl == null) return res.sendStatus(404)

   shortUrl.clicks++
   shortUrl.save()

   res.redirect(shortUrl.full)
})

app.listen(5000, () => console.log(`App listening at http://localhost:5000`));