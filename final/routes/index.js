const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var phone = '';
var mail = '';
var designation = '';
var present = '';
var tags = '';
var username = 'vishal260700';

app.post('/tagbtn',function(req,res,next){
  var item = {
    tags : req.body.tag
  };
    // socket.join(username);
    MongoClient.connect(url, function(err, client) {
      if(err){
        console.log("Error in seeing tags");
      }
      var messageS;
      // console.log("Seeing tags of "+whosetags);  
      var mydatabase=client.db("tagsldifjjs");
      messageS=mydatabase.collection(req.body.tag);
      messageS.insertMany([{people:req.user.username,like:0}]);
    client.close();
    });
  const v=url;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).updateOne({"username":req.user.username},{$addToSet: item}, function(err, res) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});
app.post('/tagsearch', function(req, res, next){
  var results=[];
  var tag = req.body.tag;
  var username=req.user.username;
    MongoClient.connect(url, function(err, client) {
      if(err){
        console.log("Error in seeing tags");
      }
      // console.log("Seeing tags of "+whosetags);  
      var mydatabase=client.db("tagsldifjjs");
      console.log("The tag is "+tag);
      const messageS=mydatabase.collection(tag);
      messageS.find({}).toArray(function(err,docs){
        assert.equal(err,null);
        // console.log(docs);
        for(var x of docs)
          results.push({username:x.people,about:"He has "+x.like,tag:tag});

    client.close();

    // console.log(results);
    res.render('search',{
      searchresults:results,searchfor : tag
    });
      });
    });

});
app.get('/', ensureAuthenticated,function(req, res) {
//   exports=module.exports=function(io){
//   io.sockets.on('connection',function(socket){
//     socket.emit('username',req.user.username);
//   });
// };
  var v=url+req.user.username;
MongoClient.connect(v, function(err, db) {
  if (err) console.log("error recieved");
  const dbo = db.db(req.user.username);
  dbo.collection(req.user.username).findOne({}, function(err, result) {
    if (err) console.log('Error detected');
    try{
      phone = result.phone;
    }
    catch(e){};
    try
    {
      mail = result.mail;
    }
    catch(e){};
    try
    {
      designation = result.designation;
    }
    catch(e){};
    try
    {
      if(result.present)present = result.present;
    }
    catch(e){};
    try{
      tags = result.tags;
    }
    catch(e){};
      res.render('dashboard',{
      title : req.user.username,
      username : req.user.username,
      mail : mail,
      phone : phone,
      designation : designation,
      cc : present,
      t1: tags[0],
      t2 : tags[1],
      t3 : tags[2],
      f1 : 'Vipul Shankhpal',
      f2 : 'Ayush Soneria',
      f3 : 'Sudhanshu Bansal',
      f4 : 'Jayesh'
    });
    console.log(result);
    db.close();
  });
});

});
app.get('/user.json', function(req, res, next) {
  res.json({username: req.user.username});
});
app.post('/update', function(req, res, next) {
  var item = {
    phone : req.body.phone,
    mail : req.body.mail,
    designation : req.body.designation,
    present : req.body.cc
  };
  console.log(item);
  const v=url+req.user.username;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).updateOne({"username":req.user.username},{$set: item}, function(err, res) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.redirect('/');
});
app.post('/update3', function(req, res, next) {
  var item = req.body.del;
  console.log(item);
  const v=url+req.user.username;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).findOneAndUpdate({$pull : {tags : item}} , function(err, res) {
      assert.equal(null, err);
      console.log('Item Deleted');
      db.close();
    });
  });
  res.redirect('/');
});
/*app.get('/search',function(req,res,next){
  var item = req.body.search;
  console.log(item);

  mongo.connect(url,function(err,db){
    assert.equal(null, err);
    const dbo = db.db("users");
    dbo.collection('user').find({"username" : username},function(err,result){
      assert.equal(null, err);
      console.log(result);
      db.close();
    });
  });
});*/
app.post('/update2', function(req, res, next) {
  var item = {
    tags : req.body.tag
  };
  console.log(item);
  const v=url+req.user.username;
  mongo.connect(v, function(err, db) {
    assert.equal(null, err);
    const dbo = db.db(req.user.username);
    dbo.collection(req.user.username).updateOne({"username":req.user.username},{$addToSet: item}, function(err, res) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  res.redirect('/');
});

app.get('/tag',ensureAuthenticated,function(req,res){
  res.render('tagging',{
    username : req.user.username
  });//add the function of inserting data in the database collection following userschema
});
app.get('/team',ensureAuthenticated,function(req,res){
  res.render('team',{
    team : 'Conectar-Family'
  });//add the function of inserting data in the database collection following userschema
});
app.get('/chat', ensureAuthenticated,function (req, res) {
 res.render('chat',{
  username : req.user.username//will add a token/ session here
 });
});
app.get('/contact', ensureAuthenticated,function (req, res) {
  res.render('contact',{
    username : 'vishal260700',//add the username which will be retrieved after validation by login form
    query : 'Contact Form'
  });
});
app.get('/about', ensureAuthenticated,function (req, res) {
 res.render('about',{
  username : 'visha260700',//same reason which we have used
  about : 'Conectar'
 });
});
app.get('/visit', ensureAuthenticated,function (req, res) {
 res.render('visit',{
  username : 'vishal260700',
  visited : 'PersonName'//we will pass the parameter for the visited person name...
 });
});
app.use(express.static(__dirname + '/public'));


// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'conectarv1@gmail.com', // generated ethereal user
        pass: 'versionnumber1'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'conectarv1@gmail.com', // sender address
      to: 'vishal260700@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });
// Get Homepage
// router.get('/', ensureAuthenticated, function(req, res){
// 	res.render('index');
// });

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

module.exports = app;