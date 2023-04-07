require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error',(error) => console.error(error))
db.once('open',() => console.log('connected to database') )

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index',{ shortUrls: shortUrls })
})
//post method for shortUrl
app.post('/shortUrl', async (req,res)=>{
await ShortUrl.create({full: req.body.fullUrl})
res.redirect('/')
})
// get method for shortUrl
app.get('/:shortUrl', async (req, res)=> {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
// app is listening to the following port
app.listen(process.env.PORT  || 5000);

