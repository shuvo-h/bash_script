const express = require('express')
const cors = require("cors")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000

var cookieParser = require('cookie-parser')

app.use(cors({
  origin: ["https://simple-test-dev.netlify.app","http://localhost:3000"],
  credentials: true
}))
app.use(cookieParser())

app.get('/cook', (req, res) => {
    
      res.cookie("jwt_token","df44g1gee65g4eg1",{
          httpOnly: true,
          maxAge: 60 * 60 * 1000,  // 1 min
          sameSite:"none",
          secure: true
      }).json({a:"Abc"})
    
    // res.send("ac")
    // res.clearCookie("access_tok").send("cook clear")
})

app.get('/recook', (req, res) => {
  console.log(req.cookies.jwt_token);
  const token = req.cookies.jwt_token ? req.cookies.jwt_token : "no cookie saved"
  res.send(token)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})