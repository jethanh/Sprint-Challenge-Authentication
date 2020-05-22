const jwt = require('jsonwebtoken')

module.exports = function validateToken(req, res, next) {
  const token = req.headers.authorization
  if(token) {
      jwt.verify(token, process.env.JWT_SECRET || 'keepitsecret,keepitsafe', (err, decodedToken) => {
          if(err) {
              res.status(401).json({message: 'token not valid'})
          }else{
              req.username = decodedToken
              next()
          }
      })
  }else{
      res.status(400).json({message: 'no auth token'})
  } 
}
