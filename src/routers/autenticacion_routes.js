import {Router} from 'express'
import passport from 'passport'
import { crearTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.get('/google', passport.authenticate('google', {scope:['profile', 'email'] }))

router.get ('/google/callback', passport.authenticate('google',{
    session: false,
    failureRedirect: '/usuarios/login'
}), (req, res) =>{
    const token = crearTokenJWT(req.user._id, req.user.rol)
    res.redirect(`${process.env.URL_FRONTEND}oauth-success?token=${token}`)
})

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/facebook/callback', passport.authenticate('facebook', {
  session: false,
  failureRedirect: '/usuarios/login'
}), (req, res) => {
  const token = crearTokenJWT(req.user._id, req.user.rol)
  res.redirect(`${process.env.URL_FRONTEND}/oauth-success?token=${token}`)
})


export default router
