import * as express from 'express'
import { authRouter } from './auth'
var router = express.Router()


router.get('/', (req, res, next) => {
  if (req.session.user && req.cookies.user_id) {
    res.render('index', { 
      title: 'chatroom demo',
      me: req.session.user 
    })
  } else {
    res.redirect('/auth/login')
  }
})

router.post('/', (req, res, next) => {
  res.locals.user = req.session.user = req.body.username
  res.redirect('/')
})

export const root = router;
export const auth = authRouter;