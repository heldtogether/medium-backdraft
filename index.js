var express = require('express');
var medium = require('medium-sdk')

var app = express();

app.get('/auth', function (req, res) {
	var client = new medium.MediumClient({
		clientId: '4d200404ffd3',
		clientSecret: '47a9b71ce0c333024065a2452d9dc20562db5f9d'
	});
	var url = client.getAuthorizationUrl(
		'secretState',
		'http://127.0.0.1:5000/auth/callback',
		[medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST]
	);
	res.redirect(url);
});

app.get('/auth/callback', function (req, res) {
	var client = new medium.MediumClient({
		clientId: '4d200404ffd3',
		clientSecret: '47a9b71ce0c333024065a2452d9dc20562db5f9d'
	});
	client.exchangeAuthorizationCode(
		req.query.code,
		'http://127.0.0.1:5000/auth/callback',
		function (err, token) {
			client.getUser(function (err, user) {
				console.log(user);
				// client.createPost({
				// 	userId: user.id,
				// 	title: 'A new post',
				// 	contentFormat: medium.PostContentFormat.HTML,
				// 	content: '<h1>A New Post</h1><p>This is my new post.</p>',
				// 	publishStatus: medium.PostPublishStatus.PUBLIC,
				// 	publishedAt: '2004-02-12T15:19:21+00:00'
				// }, function (err, post) {
				// 	console.log(token, user, post);
				// });
			});
		}
	);
});


app.listen(5000, function () {
 	console.log('Example app listening on port 5000!');
});

//
// var medium = require('medium-sdk')
//
// var client = new medium.MediumClient({
// 	clientId: '4d200404ffd3',
// 	clientSecret: '47a9b71ce0c333024065a2452d9dc20562db5f9d'
// });
//
// var url = client.getAuthorizationUrl(
// 	'secretState',
// 	'http://127.0.0.1:5000/callback',
// 	[medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST]
// );
//
// client.exchangeAuthorizationCode(code, redirectUrl, callback) {
//
// // (Send the user to the authorization URL to obtain an authorization code.)
//
// client.ExchangeAuthorizationCode('YOUR_AUTHORIZATION_CODE', function (err, token) {
// 	client.getUser(function (err, user) {
// 		client.createPost({
// 			userId: user.id,
// 			title: 'A new post',
// 			contentFormat: medium.PostContentFormat.HTML,
// 			content: '<h1>A New Post</h1><p>This is my new post.</p>',
// 			publishStatus: medium.PostPublishStatus.DRAFT
// 		}, function (err, post) {
// 			console.log(token, user, post)
// 		});
// 	});
// });
