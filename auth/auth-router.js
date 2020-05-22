const router = require('express').Router();
const bcrypt = require('bcryptjs')
const users = require('./authModel')
const jwt = require('jsonwebtoken')

router.post('/register', (req,res) => {
  const { username, password  } = req.body
  if(!username || !password) {
      res.status(403).json({message: 'please input user/pass'})
  }else{
      users.insert({username, password: bcrypt.hashSync(password, 4)})
          .then(user => {
              res.status(200).json({message: 'u did it hooray', username: username})
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({message: ':( uh oh'})
          })
  }

})


router.post('/login', (req,res) => {
  const { username, password } = req.body
  if(req.body) {
      users.findByUsername(username)
          .then(user => {
              if(user && bcrypt.compareSync(password, user.password)) {
              const token = generateToken(user)
              res.status(200).json({message: 'login successful', username: username, token})
              } else {
                res.status(400).json({message: "invalid user/password"})
              }
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({message: ':( uh oh'})
          })
  } else {
    res.status(400).json({ message: "please provide user and pass" })
  }
})

function generateToken(user) {
  const payload = {
      username: user.username,
      department: user.department
  }
  const options = {
      expiresIn: '1d'
  }
  return jwt.sign(payload, process.env.JWT_SECRET || 'keepitsecret,keepitsafe', options)
}


module.exports = router;
