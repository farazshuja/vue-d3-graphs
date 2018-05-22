import passport from 'passport'
import { BasicStrategy } from 'passport-http'

const authUsers = [
  {
    username: 'guest6',
    password: '8ZumrE7e'
  }
]

passport.use(new BasicStrategy((username, password, done) => {
  const user = authUsers.find(u => u.username === username && u.password === password)

  if(user)
    return done(null, user)
  else
    return done(null, false)
}))

export default passport