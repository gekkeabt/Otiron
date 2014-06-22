var express = require("express");
var http = require("http");
var bodyParser = require('body-parser');
var fs = require('fs');
var Datastore = require('nedb');
var app = express();
app.use(express.static(__dirname + '/'));
app.use(bodyParser());
var webport = 4999;


// Start server
var port = process.env.PORT || webport;
app.listen(port, function() {
	console.log('Website available on: http://127.0.0.1:' + port);
});
app.get("/gettodos", function(req, res) {
	var db = new Datastore({ filename: 'todos.json' });
	db.loadDatabase(function (err) {
		var query = req.query.query;
		if(query=="insert"){
			var todo = {text: req.query.text,status:req.query.status};
			db.insert(todo, function (err, newTodo) {});
		}
		if(query=="update"){
			var todoid = req.query.id;
			db.update({ _id: todoid }, { $set: { status: req.query.status } }, { multi: true }, function (err, numReplaced) {});
		}
		if(query=="updateSection"){
			var status = req.query.status;
			var statusold = req.query.statusold;
			db.update({ status: statusold }, { $set: { status: req.query.status } }, { multi: true }, function (err, numReplaced) {});
		}
		if(query=="remove"){
			var todoid = req.query.id;
			db.remove({ _id: todoid}, {}, function (err, numRemoved) {});
		}
		if(query=="removeAllFromSection"){
			var status = req.query.status;
			db.remove({status:status}, {multi:true}, function (err, numRemoved) {});
		}
		db.find({}, function (err, docs) {
			res.send(docs);
		});
	});
});
app.get("/getsections", function(req, res) {
	var db = new Datastore({ filename: 'sections.json' });
	db.loadDatabase(function (err) {
		var query = req.query.query;
		if(query=="insert"){
			var todo = {text: req.query.text};
			db.insert(todo, function (err, newTodo) {});
		}
		if(query=="update"){
			var sectionid = req.query.id;
			db.update({ _id: sectionid }, { $set: { text: req.query.text } }, { multi: true }, function (err, numReplaced) {});
		}
		if(query=="remove"){
			var sectionid = req.query.id;
			db.remove({ _id: sectionid}, {}, function (err, numRemoved) {});
		}
		if(query=="remove"){
			var sectionid = req.query.id;
			db.remove({ _id: sectionid}, {}, function (err, numRemoved) {});
		}
		db.find({}, function (err, docs) {
			res.send(docs);
		});
	});
});
app.get(/^(.+)$/, function(req, res){
	try{
		res.sendfile( __dirname + req.params[0]);
	}catch(err){

	}
});
