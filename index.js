const express = require('express')
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())


app.get('/cook', (req, res) => {
    
    res.cookie("testSiteCook","df44g1gee65g4eg1",{
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true
    }).json({a:"Abc"})

})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})