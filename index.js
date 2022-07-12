const express = require('express')
const cors = require("cors")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000

var cookie = require('cookie');

app.use(cors({
  origin: ["https://simple-test-dev.netlify.app","http://localhost:3000"],
  credentials: true
}))

app.get('/cook', (req, res) => {
    /*
      res.cookie("testSiteCook","df44g1gee65g4eg1",{
          httpOnly: true,
          expires: new Date(Date.now() + 25892000000),
          sameSite: "strict",
          // secure: true
      }).json({a:"Abc"})
    */
      res.setHeader('Set-Cookie', cookie.serialize('name', String("query.name"), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }))
      res.json({we:"Ended Response"})

})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})