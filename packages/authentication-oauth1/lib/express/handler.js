const Debug = require('debug');

const debug = Debug('@feathersjs/authentication-oauth1:handler');

module.exports = function OAuthHandler (options = {}) {
  return function (req, res, next) {
    const app = req.app;
    const authSettings = app.get('auth') || app.get('authentication') || {};
    const entity = req[options.entity];
    const payload = req.payload;
    const params = {
      authenticated: true,
      [options.entity]: entity,
      payload
    };
    const data = {
      [options.entity]: entity,
      payload
    };

    debug(`Executing '${options.name}' OAuth Callback`);
    debug(`Calling create on '${authSettings.path}' service with`, entity);
    app.service(authSettings.path).create(data, params).then(result => {
      res.data = result;

      if (options.successRedirect) {
        res.hook = { data: {} };
        Object.defineProperty(res.hook.data, '__redirect', { value: { status: 302, url: options.successRedirect } });
      }

      next();
    }).catch(next);
  };
};
