const express = require('express')
const route = express.Router()
const db = require ('../models')



const userController= require('../controllers/userController')
const { sendResetPasswordEmail } = require('../nodemailer/ResetPassword')



route.get('/api/isAuth', (req, res) => {
  const token = req.headers.authorization
  db.User.findOne({ where: { token: token } })
    .then((user) => {
      if (user) {
        return res.status(200).json({ status: "success" })
      } else {
        return res.status(401).json({ status: "error", message: "Utilisateur introuvable." })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    })
})

route.post('/api/register',(req, res) => {

    userController.register(req.body.username,req.body.email,req.body.phone,req.body.password,req.body.repeatPassword)
    .then(response => res.status(200).json(response))
    .catch(err=>res.status(400).json(err))

})
 


route.post('/api/login', (req, res) => {
  userController.login(req.body.email, req.body.password)
    .then(token => {
      serverToken = token // Stocker le token dans la variable globale côté serveur
      res.status(200).json({ token: token })
    })
    .catch(err => res.status(400).json(err))
})
route.post('/api/login/desktop', (req, res) => {
  userController.loginDesktop(req.body.email, req.body.password)
    .then(token => {
      serverToken = token // Stocker le token dans la variable globale côté serveur
      res.status(200).json({ token: token })
    })
    .catch(err => res.status(400).json(err))
})

route.get('/api/logout', (req, res) => {
  const token = req.headers.authorization.trim() 
  console.log(token) 
  db.User.update({ token: null }, { where: { token: token } })
    .then(() => {
      
      res.json({ status: "Success" })
      
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    })
})



route.get('/api/user/:id',(req, res) => {
    db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      } else {
        res.json(user)
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    })
})



route.get('/api/users',(req, res)=>{
    db.User.findAll()
    .then((response) =>res.status(200).send(response) )
    .catch((err)=>res.status(400).send(err))
})

route.patch('/api/updateuser/:id',(req, res)=>{
    db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      } else {
        user.update(req.body)
          .then((updatedUser) => {
            res.json(updatedUser)
          })
          .catch((error) => {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
          })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    })
})



route.delete('/api/deleteuser/:id',(req, res) => {
    db.User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      } else {
        user.destroy()
          .then(() => {
            res.json({ message: 'User deleted successfully' })
          })
          .catch((error) => {
            c
            res.status(500).json({ message: 'Internal server error' })
          })
      }
    })
    .catch((error) => {
      
      res.status(500).json({ message: 'Internal server error' })
    })
})

route.post('/api/auth/verifyuser/:activationcode',userController.verifyUser)
route.post('/api/newpassword/:activationcode', (req, res) => {
  const { password, repeatPassword } = req.body
  const activationcode = req.params.activationcode
  console.log(activationcode)


  userController.newPassword(password, repeatPassword, activationcode)
    .then(response => {
      res.status(200).json(response)
    })
    .catch(err => {
      res.status(400).json(err)
    })
})
// route.post('/api/auth/resetpassword/:activationcode',userController.resetPassword)

route.post('/api/resetpassword/',(req,res) => {
  db.User.findOne({ where: { email: req.body.email } }).then((user)=>{
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    } else {
      sendResetPasswordEmail(user.email , user.activationCode)
      res.json({ message: 'Success' })
      }
  })
})

route.patch('/api/updaterole/:id',userController.updateRole)

module.exports = route