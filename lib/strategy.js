/*
    Copyright (C) WWPASS Corporation 2023
    Author: Eugene Medvedev <Eugene.Medvedev@wwpass.com>
*/

const OpenIDConnectStrategy = require('passport-openidconnect');
const util = require('util');

/**
 * WWPass exposes an an OpenIDConnect/OAUTH2 server, we just need to use it.
 *
 * Applications must supply a `verify` callback which accepts an `issuer`,
 * and `profile`, and then calls the `cb` callback supplying a `user`,
 * which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Important options:
 *   - `clientID`      your client id
 *   - `clientSecret`  your client secret
 *   - `callbackURL`   URL to which WWPass will redirect the
 *                     user after granting authorization, must match the one
 *                     configured in WWPass management interface.
 *
 * This is a thin wrapper around passport-openidconnect, and you can override
 * other options as required.
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
    options = options || {};
    options.issuer = options.issuer || 'https://oidc.wwpass.com';
    options.authorizationURL =
        options.authorizationURL || 'https://oidc.wwpass.com/authorization';
    options.tokenURL = options.tokenURL || 'https://oidc.wwpass.com/token';
    options.userInfoURL =
        options.userInfoURL || 'https://oidc.wwpass.com/userinfo';
    options.scope = options.scope || ['openid', 'email', 'profile'];

    OpenIDConnectStrategy.call(this, options, verify);
    this.name = 'wwpass-oidc';
}

util.inherits(Strategy, OpenIDConnectStrategy);

module.exports = Strategy;
