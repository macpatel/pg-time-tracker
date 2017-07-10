/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var request = require('request');
var jwt = require('jwt-simple');

function createJWT (user) {
  console.log(" in create JWT " + user.id);
    var payload = {
      sub: user.id,
    };
    return jwToken.issue(payload, sails.config.myconfig.FB_TOKEN_SECRET);
  }


module.exports = {
  login: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }

    User.findOne({email: email}, function (err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid email or password'});
      }

      User.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid email or password'});
        } else {
          res.json({
            user: user,
            token: jwToken.issue({id : user.id })
          });
        }
      });
    })
  },
  adminLogin: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }

    User.findOne({email: email, is_admin: true}, function (err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid email or password'});
      }

      User.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid email or password'});
        } else {
          res.json({
            user: user,
            token: jwToken.issue({id : user.id })
          });
        }
      });
    })
  },
  provider: function(req, res){
    console.log('logging provider');
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.8/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.8/me?fields=' + fields.join(',');
    var params = {
      code: req.body.code,
      client_id: sails.config.myconfig.FB_CLIENT_ID,
      client_secret: sails.config.myconfig.FB_CLIENT_SECRET,
      redirect_uri: req.body.redirectUri
    };

  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    console.log('logging provider 1 ' + response.statusCode);
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }
   // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        var userProfile = profile;
        console.log('logging provider 2 ' + response.statusCode);
        console.log('logging provider profile ' + profile.email);
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }
        User.findOne({ email: profile.email }, function(err, existingUser) {
          if (existingUser) {
            console.log('in existing user');
            var token = createJWT(existingUser);
            return res.send({ 
              user:existingUser,
              token: token 
            });
          }
          console.log('created new user ' + userProfile.email);

          User.create({
            'username' : userProfile.name,
            'email' : userProfile.email,
            'password' : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          }).exec(function (err, user){
              if (err) { return res.serverError(err); }
              res.send({ 
                user: user,
                token: createJWT(user) 
              });
            });
            
        });
      });    
  });    

  },
  callback: function(req, res){
    console.log('in callback');
  },

};