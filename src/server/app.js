import express from 'express'
import path from 'path'
import passport from './auth'

const app = express()

app.get('/status', (req, res) => {
  res.send('OK')
})

app.use(passport.initialize())
app.use(passport.authenticate('basic', { session: false }))
app.use(express.static(path.resolve(__dirname, '../../dist')))

export default app