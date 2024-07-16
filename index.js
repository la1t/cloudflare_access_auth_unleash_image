'use strict';

const unleash = require('unleash-server');

function cloudflareAccessAuth(app, config, services) {
  const { userService } = services;

  app.use('/api/', async (req, res, next) => {
    const email = req.get('cf-access-authenticated-user-email');
    if (email) {
      const user = await userService.loginUserWithoutPassword(email, true);
      req.user = user;
      req.session.user = user;
    }
    
    return next();
  });
}

unleash.start({
  authentication: {
    type: 'custom',
    customAuthHandler: cloudflareAccessAuth,
  },
  server: {
    enableRequestLogger: true,
  },
  logLevel: 'info',
});
