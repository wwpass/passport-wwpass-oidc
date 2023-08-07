# passport-wwpass-oidc

[Passport](https://www.passportjs.org/) strategy for authenticating with
[WWPass](https://wwpass.com/) through the [OpenID Connect](https://www.passportjs.org/features/openid-connect/) interface.

[![npm](https://img.shields.io/npm/v/passport-wwpass-oidc.svg)](https://www.npmjs.com/package/passport-wwpass-oidc)

## Installation

```bash
npm install passport-wwpass-oidc
```

## Usage

### Configure WWPass

In <https://manage.wwpass.com/> management interface, enable `IdP` for your application. You also need to enable the `token` response type, and set a specific `Redirect URI`. This URL must match the one you will configure in Express when configuring the strategy.

Be aware that WWPass only shows you your client secret _once_, so be ready to save it.

### Configure Strategy

The strategy needs to be configured with your application's client ID and secret, as well as the `Redirect URI`, which must match the one defined in WWPass management interface.

The strategy takes a `verify(issuer, profile, done)` function as an argument. `issuer` is set to `https://oidc.wwpass.com`,
indicating that the user came in through WWPass -- if you're using multiple OIDC providers, you can use the same verify function with all of them and handle things differently based on this parameter. `profile` contains the user's
[profile information](https://www.passportjs.org/reference/normalized-profile/)
which they define in WWPass interfaces.

The `verify` function is responsible for associating a user object with the WWPass account, and needs to take care of cases when it should exist but doesn't. To complete, it must call `done(null, user)` to pass on a valid user, `done(null, false, [message])` in case the verification failed, and `done(new Error(<...>))` in case of internal errors.

```js
var WWPassOIDC = require("passport-wwpass-oidc");

passport.use(
    new WWPassOIDC(
        {
            clientID: "d19fa9b4-ffff-ffff-ffff-c780c83f3800",
            clientSecret:
                "b4e4571efcdbbb41dfb90ea8d8e336de74c5918d9e3f8d30e2763feeeeeeeeee",
            callbackURL: "http://localhost:3000/oidc-callback",
        },
        function verify(issuer, profile, done) {
            console.log("Verify callback results:", issuer, profile, done);
            done(null, profile);
        }
    )
);
```

### Define Routes

You will need two routes -- one to send the user to WWPass to be authenticated, and one for the user to be redirected to from WWPass after they have been authenticated:

```js
// Sending the user away...
app.get("/login/wwpass-oidc", passport.authenticate("wwpass-oidc"));

// Accepting them back.
app.get(
    "/login/oauth2/redirect/wwpass",
    passport.authenticate("wwpass-oidc", {
        failureRedirect: "/login",
        failureMessage: true,
    }),
    function (req, res) {
        res.redirect("/");
    }
);
```

### Other reading

+ [Passport: The Hidden Manual](https://github.com/jwalton/passport-api-docs) helps a lot with understanding Passport instead of blindly using recipes.
+ [passport-wwpass](https://github.com/wwpass/passport-wwpass) is a Passport strategy which uses WWPass's native interface, which may or may not be more suitable to your needs.
+ [passport-openidconnect](https://github.com/jaredhanson/passport-openidconnect) -- `passport-wwpass-oidc` is ultimately a thin wrapper over `passport-openidconnect`, and all does not document the many configuration options it does not directly use, which are, nevertheless, available.

## License

This program is licensed under the terms of [MIT License](LICENSE).

Copyright (c) 2023 WWPass Corporation.
