'use strict';

const unleash = require('unleash-server');
const passport = require('@passport-next/passport');
const CustomStrategy = require('passport-custom').Strategy;

function cloudflareAccessAuth(app, config, services) {
  const { userService } = services;

  passport.use(
    new CustomStrategy(async (req, done) => {
      console.log(req.headers)
      const email = req.headers['cf-access-authenticated-user-email'];
      console.log(email)
      if (!email) {
        done(null, null);
      }
      const user = await userService.loginUserWithoutPassword(email, true);
      console.log(user)
      done(null, user);
    }),
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  app.use('/api/', passport.authenticate('custom', { session: false }));
}

const options = {
  authentication: {
    type: 'custom',
    customAuthHandler: cloudflareAccessAuth,
  },
};

unleash.start(options);
