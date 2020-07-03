[![npm](https://img.shields.io/npm/v/passport-auth-staq.svg)](https://www.npmjs.com/package/passport-auth-staq)

# passport-auth-staq

[Passport](http://passportjs.org/) strategy for authenticating with [AuthStaq](https://auth.staqsoftware.com)
using the OAuth 2.0 protocol.

This module lets you authenticate using AuthStaq in your node applications.
By plugging into Passport, AuthStaq authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Usage

#### Create an Application
Before using `passport-auth-staq`, you must register an application with
AuthStaq.  If you have not already done so, a new application can be created on the
[AuthStaq platform](https://auth.staqsoftware.com/register).
Your application will be issued a client ID and client secret, which need to be
provided to the strategy.  You will also need to configure a redirect URI which
matches the route in your application.

#### Setup
```javascript
const passport = require('passport')
const AuthStaqStrategy = require('passport-auth-staq')

// Initialize passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set up AuthStaqStrategy
passport.use(new AuthStaqStrategy({
    clientID: 'abc-123',
    clientSecret: 'super-secret',
    callbackURL: `${hostName}/auth/callback`
  }, function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
  })
)

// Save profile returned from authentication into session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Load authenticated profile from session
passport.deserializeUser((user, done) => {
  done(null, user)
})


// Authentication route, will redirect to AuthStaq to handle authentication and redirect to configured callback once complete  
app.get('/auth/staq', passport.authenticate('auth-staq', {}))
// Callback route, will verify authentication and load the user profile.  The result is passed to serializeUser above.
app.get('/auth/staq/callback',
  passport.authenticate('auth-staq', { failureRedirect: '/auth/staq' }),
  function(req, res) {     
    res.redirect('/private/route')
  }
)

// Bonus, ensure users are signed in before accessing private endpoints
function requireUser(req, res, next) {
  if (!req.session.passport.user) {
    return res.redirect('/auth/staq')
  } 
  return next()
}

app.get('/private/route', requireUser, (req, res) => { 
  return res.send(`Welcome ${req.session.passport.user.firstName}`)
})
```

#### Profile
The AuthStaq profile returned from this strategy has these properties:
* id: The AuthStaq user id
* email: The email address the user used to register with your application
* firstName: The user's first name
* lastName: The user's last name

## Contributing
Feel free to open issues or pull requests!
