var express = require('express');
var medium = require('medium-sdk');
var bodyParser = require('body-parser')


// Setup

var APP_PORT = process.env.PORT || 5000;
var APP_URL = (process.env.NODE_ENV == 'production') ?
	'https://medium-backdraft.herokuapp.com' :
	'http://127.0.0.1:'+APP_PORT;

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

var mediumClient = new medium.MediumClient({
	clientId: 'XXX',
	clientSecret: 'XXX'
});

var mediumUser;

var appSecret = "fjiownfneworg849Y8974t8t9OAEIJoncaipPE*yryw9rw";


// Helpers

var parseCookies = function (req) {
	var list = {};
	var rc = req.headers.cookie;
	rc && rc.split(';').forEach(function( cookie ) {
		var parts = cookie.split('=');
		list[parts.shift().trim()] = decodeURI(parts.join('='));
	});
	return list;
}


// Index

app.get('/', function (req, res) {
	res.render('index');
});


// Auth

app.get('/auth', function (req, res) {
	var url = mediumClient.getAuthorizationUrl(
		appSecret,
		APP_URL+'/auth/callback',
		[medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST]
	);
	res.redirect(url);
});

app.get('/auth/callback', function (req, res) {
	mediumClient.exchangeAuthorizationCode(
		req.query.code,
		APP_URL+'/auth/callback',
		function (err, token) {
			mediumClient.getUser(function (err, user) {
				if (err) {
					res.render('error');
				} else {
					mediumUser = user;
					res.cookie('mediumToken', token.access_token);
					res.redirect('/editor');
				}
			});
		}
	);
});


// Editor

app.route('/editor')
.all(function(req, res, next) {
	var cookies = parseCookies(req);
	if (!cookies.mediumToken) {
		res.redirect('/');
	} else {
		mediumClient.setAccessToken(cookies.mediumToken);
		mediumClient.getUser(function (err, user) {
			if (err) {
				res.redirect('/');
			} else {
				mediumUser = user;
				next();
			}
		});
	}
})
.get(function(req, res, next) {
	res.render('editor');
})
.post(function(req, res, next) {
	mediumClient.createPost({
		userId: mediumUser.id,
		title: req.body.post_title,
		contentFormat: medium.PostContentFormat.HTML,
		content: req.body.post_body,
		publishStatus: medium.PostPublishStatus.PUBLIC,
		publishedAt: req.body.post_date+'T04:00:00+00:00'
	}, function (err, post) {
		if (err) {
			res.render('error');
		} else {
			res.render('success');
		}
	});
});


// Init

app.listen(APP_PORT, function () {
 	console.log('Example app listening on port ' + APP_PORT);
});
