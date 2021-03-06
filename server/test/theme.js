let chai = require('chai');
let should = chai.should();
let Theme = require('../models/Theme');
let config = require('../config/config');
let ConfigureAuth = require('./ConfigureAuth.js');
let request = require('supertest');

//Schema Test
describe('Theme Settings Model', function() {
    it('should create(POST) a new setting', function(done) {
        let theme = new Theme({
            user_id: "test", //company or user id
            form_color: "default",
            background_img: "default",
            displayPhone: false,
            displayClock: false,
            displaySignature: false,
            additionalComments: false
        });
        theme.save(function(err) {
            if (err) return done(err);
            done();
        });
    });

    it('should update(PUT) theme setting', function(done) {
        Theme.findOne({
            user_id: "test"
        }, function(err, theme) {

            theme.user_id = "test"; //company or user id
            theme.form_color = "default";
            theme.background_img = "default";
            theme.displayPhone = false;
            theme.displayClock = true;
            theme.displaySignature = false;
            theme.additionalComments = true;
            theme.save(function(err) {
                theme.background_img.should.equal('default');
                theme.form_color.should.equal('default');
                theme.displayClock.should.equal(true);
                theme.displayPhone.should.equal(false);
                theme.displaySignature.should.equal(false);
                theme.additionalComments.should.equal(true);
                if (err) return done(err);
                done();
            });

            if(err) {
                console.log("Error Updating Theme");
                return done(err);
            }
        });
    });

});

//Route Tests need to be changed to work with auth

describe("Themes Route Test", function() {
        let credentials;  // variable to hold all the need authentication variables.

        // before function is called at the very beginning of the 'Forms' test suite,
        // no tests are run until the done() callback is called.
        before(function(done) {
            // setupAdmin will create and admin and log you in, give it a callback that will give you
            // the credentials you need. Make sure to call done() inside ConfigureAuth's callback!
            ConfigureAuth.setupAdmin(function(cred) {
                credentials = cred;
                done();
            });
        });



        describe('POST /api/:user_id/theme', function() {
            it('should respond with theme info for respective user_id settings that were created for first time user', function(done) {
                let url = "localhost:" + config.port;
                let _user_id = '1';
                let _form_color = 'default';
                let _background_img = 'default';
                let _displayPhone = false;
                let _displayClock = false;
                let _displaySignature = false;
                let _additionalComments = false;
                request(url)
                    .post('/api/' + _user_id + '/theme')
                    .query({email: credentials.email, token: credentials.token})
                    .send({
                        form_color: _form_color,
                        background_img: _background_img,
                        displayPhone: _displayPhone,
                        displayClock: _displayClock,
                        displaySignature: _displaySignature,
                        additionalComments: _additionalComments
                    })
                    .end(function(err, res) {
                        res.body.should.have.property('user_id');
                        res.body.should.have.property('form_color');
                        res.body.should.have.property('background_img');
                        res.body.should.have.property('displayPhone');
                        res.body.should.have.property('displayClock');
                        res.body.should.have.property('displaySignature');
                        res.body.should.have.property('additionalComments');

                        res.body.user_id.should.equal(_user_id);
                        res.body.form_color.should.equal(_form_color);
                        res.body.background_img.should.equal(_background_img);
                        res.body.displayPhone.should.equal(_displayPhone);
                        res.body.displayClock.should.equal(_displayClock);
                        res.body.displaySignature.should.equal(_displaySignature);
                        res.body.additionalComments.should.equal(_additionalComments);

                        if(err) {
                            console.log("Error Saving Theme");
                            done(err);
                        }

                        done();
                    });
            });
        });

        describe('GET /api/:user_id/theme', function() {
            it('should respond with theme info for respective user_id', function(done) {
                let url = "localhost:" + config.port;
                let user_id = '1';
                request(url)
                    .get('/api/' + user_id + '/theme')
                    .query({email: credentials.email, token: credentials.token})
                    .end(function(err, res) {
                        res.body.should.have.property('_id');
                        res.body.should.have.property('additionalComments');
                        res.body.should.have.property('user_id');
                        res.body.should.have.property('form_color');
                        res.body.should.have.property('background_img');
                        res.body.should.have.property('displayPhone');
                        res.body.should.have.property('displayClock');
                        res.body.should.have.property('displaySignature');

                        if(err) {
                            console.log("Error retrieving theme");
                            done(err);
                        }
                        done();
                    });
            });
        });



        describe('PUT /api/:user_id/theme', function() {
            it('should respond with theme info for respective user_id settings that were updated', function(done) {
                let url = "localhost:" + config.port;
                let _user_id = '1';
                let _form_color = "1";
                let _background_img = "1";
                let _displayPhone = false;
                let _displayClock = false;
                let _displaySignature = false;
                let _additionalComments = false;
                request(url)
                    .put('/api/' + _user_id + '/theme')
                    .query({email: credentials.email, token: credentials.token})
                    .send({
                        form_color: _form_color,
                        background_img: _background_img,
                        displayPhone: _displayPhone,
                        displayClock: _displayClock,
                        displaySignature: _displaySignature,
                        additionalComments: _additionalComments
                    })
                    .end(function(err, res) {
                        res.body.should.have.property('user_id');
                        res.body.should.have.property('form_color');
                        res.body.should.have.property('background_img');
                        res.body.should.have.property('displayPhone');
                        res.body.should.have.property('displayClock');
                        res.body.should.have.property('displaySignature');
                        res.body.should.have.property('additionalComments');

                        res.body.user_id.should.equal(_user_id);
                        res.body.form_color.should.equal(_form_color);
                        res.body.background_img.should.equal(_background_img);
                        res.body.displayPhone.should.equal(_displayPhone);
                        res.body.displayClock.should.equal(_displayClock);
                        res.body.displaySignature.should.equal(_displaySignature);
                        res.body.additionalComments.should.equal(_additionalComments);

                        if(err) {
                            console.log("Error updating theme");
                            done(err);
                        }
                        done();
                    });
            });
        });

        describe('DELETE /api/:user_id/theme', function() {
            it('should respond with successful delete', function(done) {
                let url = "localhost:" + config.port;
                let user_id = '1';
                request(url)
                    .delete('/api/' + user_id + '/theme')
                    .query({email: credentials.email, token: credentials.token})
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.have.property("msg");
                        if(err) {
                            console.log("Error deleting theme settings");
                            done(err);
                        }
                        done();
                    });
            });
        });


        after(function(done) {
            // give cleanupAuth the email of the admin user it created earlier.
            ConfigureAuth.cleanupAuth(credentials.email, done);
        });
    }
);
