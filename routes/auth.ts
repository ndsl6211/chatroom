import * as express from 'express'

import { validateUser } from '../utils/auth.helper'

var router = express.Router()


router.get('/login', (req, res, next) => {
  if (req.cookies.user_id && req.session.user) {
    res.redirect('/')
  } else {
    res.render('login', { failed: false, message: 'failed to login' })
  }
})

router.post('/auth', (req, res, next) => {
  var user: any = validateUser(req.body.username, req.body.password)
  if (user) {
    req.session.user = user
    res.redirect('/')
  } else {
    res.render('login', { failed: true, message: 'failed to login' })
  }
})

router.get('/logout', (req, res, next) => {
  if (req.cookies.user_id && req.session.user) {
    res.clearCookie('user_id')
    res.redirect('/')
  } else {
    res.redirect('/auth/login')
  }
})

export const authRouter = router