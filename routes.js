
/**
 * Main application routes
 */

'use strict'

const path = require('path');

module.exports = function(app, matador) {

    app.route('/api/*')
        .all(function(req, res, next) {
            res.setToken = function(token) {
                res.setHeader('Auth-Token', token);
                res.token = token;
            };

            res.finish = function(data) {
                if (1 == arguments.length) {
                    if ('number' == typeof data) {
                        res.status(data);
                    }
                }

                if (2 == arguments.length) {
                    if ('number' == typeof arguments[1]) {
                        res.status(arguments[1]);
                    } else {
                        res.status(data);
                        data = arguments[1];
                    }
                }
                data = data || {};
                if (res.token) data.token = res.token;
                res.json(data);

                /*
                var result = {
                    'data': data
                };
                if (res.token) result.token = res.token;
                res.json(result);
                */
                g_G.clog('asdf98 eCmd =', res.jReq.eCmd);

                g_G.writeToLogDB(req, res, null, function(err, ret) {
                    if (err) return g_G.error('w345665 writeToLogDB() error :' + err);
                });

            };

            next();
        });


    var cmd_dir = [
        g_G.rootDir  + '/eCmd',
    ];

    g_G.load_eCmd(app, cmd_dir,'/api/v1/');

    // All undefined api routes should return a 404
    app.route('/api/*')
        .all(function(req, res, next) {
            next(Error.new({
                code: 'API_NOT_FOUND',
                message: 'roy : API for url:' + req.url + ' is not found.'
            }));
        });

    app.use(g_G.errorHandler());

    // All other routes should redirect to the 404.html
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.join(g_G.rootDir , '../api/views/404.html'));
        });
};
