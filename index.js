const express = require('express'),
  app =  express(),
  request = require('request'),
  bodyParser= require('body-parser'),
  cookieParser = require('cookie-parser'),
  path = require("path"),
  mongoose = require('mongoose'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json'),
  appointment = require('./models/appointment');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const user = process.env.USER,
	pass = process.env.PASS,
	ip = process.env.IP,
	port = process.env.PORT,
	database = process.env.DATABASE,
	connstring = 'mongodb://' + user + ':' + pass + '@' + ip + ':' + port + '/' + database;

mongoose.connect(connstring, {useNewUrlParser: true}, function (error) {
  if (error) {
    console.log(error);
  }
  else {
    app.listen(8080, () => {
      console.log('listening on 8080')
    })
  }
});


app.post('/appointment', function(req, res, next) {
	console.log('Appointment created');
	var year = 2019,
	month = 11,
	day = 15;
	
//	var options = {
//      url: 'http://worldtimeapi.org/api/timezone/America/Argentina/Buenos_Aires',
//	  method: 'GET',
//	};
		
//	request(options, function (error, response, body) {
//		console.log( 'startDateTime: ' + JSON.parse(response.body).datetime);
//		console.log( 'endDateTime: ' + JSON.parse(response.body).datetime);
		var idparam = Math.floor(Math.random() * 100);
		data = {
			id: idparam, 
			href: "", 
			externalId: "", 
			category: "", 
			description: "Appointment " + idparam, 
			status: "initialized",
			creationDate: new Date(),
			lastUpdate: new Date(),
			validFor: { startDateTime: new Date(year, month, day), endDateTime: new Date(year, month, day+7)},
			baseType: "",
			type: "",
			schemaLocation: ""
		};
		
		appointment.updateOne({id: idparam}, data, {upsert: true}, function (err){
		  if (err) throw err;
		  res.sendStatus(200);
		  //res.json(data);
		});
		
//	});
});

app.get('/appointment', function(req, res, next) {
  console.log('Appointment Get');
  appointment.find({}, function (err, data) { 
    if (err) throw err;
    res.json(data);
  })
  //res.sendStatus(200);
});


app.get('/appointment/appointment/:id', function(req,res, next){
	console.log('Appointment Get');
	appointment.find({id: req.params.id}, function (err, data) { 
		if (err) throw err;
		res.json(data);
  })
});

app.delete('/appointment/appointment/:id', function(req,res, next){
	console.log('Appointment deleted');
	appointment.deleteOne({id: req.params.id}, function (err, data) { 
    if (err) throw err;
    res.sendStatus(204);
  })
});

app.patch('/appointment/appointment/:id', function(req,res, next){
	console.log('Appointment patched');
	appointment.updateOne({id: req.params.id}, {status: 'cancelled'}, {upsert: true}, function (err){
		if (err) throw err;
		res.sendStatus(200);
		//res.json(data);
	});
});