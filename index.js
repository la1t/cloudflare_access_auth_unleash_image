'use strict';

const unleash = require('unleash-server');
const passport = require('@passport-next/passport');
const CustomStrategy = require('passport-custom').Strategy;

function cloudflareAccessAuth(app, config, services) {
  const { userService } = services;

  passport.use(
    new CustomStrategy(async (req, done) => {
      const email = req.headers['cf-access-authenticated-user-email'];
      const user = await userService.loginUserWithoutPassword(email, true);
      done(null, user);
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.use('/api/', (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res
        .status('401')
        .end();
    }
  });
}

const options = {
  authentication: {
    type: 'custom',
    customAuthHandler: cloudflareAccessAuth,
  },
};

unleash.start(options);
