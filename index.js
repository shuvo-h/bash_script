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
    
      res.cookie("jwt_token","df44g1gee65g4eg1",{
          httpOnly: true,
          maxAge: 60 * 1000,  // 1 min
          sameSite: "strict",
          secure: true
      }).json({a:"Abc"})
    
    // res.send("ac")
    // res.clearCookie("access_tok").send("cook clear")
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})