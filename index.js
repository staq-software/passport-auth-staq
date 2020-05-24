const OAuth2Strategy = require('passport-oauth2')

class AuthStaqStrategy extends OAuth2Strategy {
  /**
   * `Strategy` constructor.
   *
   * The AuthStaq authentication strategy authenticates requests by delegating to
   * AuthStaq using the OAuth 2.0 protocol.
   *
   * Options:
   *   - `clientID`      your AuthStaq application's client id
   *   - `clientSecret`  your AuthStaq application's client secret
   *   - `callbackURL`   URL to which the user will be redirected to after authentication
   *
   * @constructor
   * @param {object} options
   * @param {function} verify
   */
  constructor(options, verify) {
    options = options || {};
    options.authorizationURL = 'https://auth.staqsoftware.com/authentication/sign-in';
    options.tokenURL = 'https://oauth.staqsoftware.com/v1/token';

    super(options, verify)
    this.name = 'auth-staq';
    this._userProfileURL = 'https://oauth.staqsoftware.com/v1/userinfo';
    this._userProfileFormat = 'openid';
  }

  /**
   * Retrieve user profile from AuthStaq.
   *
   * This function constructs a normalized profile, with the following properties:
   *
   *   - `provider`         always set to `auth-staq`
   *   - `id`
   *   - `firstName`
   *   - `lastName`
   *   - `email`
   *
   * @param {string} accessToken
   * @param {function} done
   * @access protected
   */
  userProfile(accessToken, done) {
    this._oauth2.useAuthorizationHeaderforGET(true)
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
      if (err) {
        return done(new Error('Failed to fetch user profile', err));
      }

      try {
        const profile = JSON.parse(body).data;
        profile.provider  = 'auth-staq';
        return done(null, profile);
      } catch (ex) {
        return done(new Error('Failed to parse user profile'));
      }
    });
  }
}


module.exports = AuthStaqStrategy;
module.exports.AuthStaqStrategy = AuthStaqStrategy;