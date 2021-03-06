const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const async=require('async');
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
var user_about = '';
var name='';
var username="";

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
        // for(var x of docs)
        //   results.push({username:x.people,about:"He has "+x.like,tag:tag});
          async.each(docs,function(usr,callback){
            var abcd=url+usr;
            mongo.connect(abcd,function(err,db2){
              if(err) throw err;
              var db123=db2.db(usr.people);
              db123.collection(usr.people).findOne({},{fields: {'_id':0,'user_about':1,'tags':1}},function(err,reslt)
              {
                if (err) throw err;
                    try
                    {
                      // console.log(result.user_about);
                      if(reslt.user_about==null)
                      {
                        results.push({username:usr.people,tags:reslt.tags,like:usr.like,tag:tag});
                      }
                      else{
                        results.push({username:usr.people,about:reslt.user_about,tags:reslt.tags,like:usr.like,tag:tag});
                      }
                      // results.push({username:result.username,about:user_about});
                    }
                    catch(e){}
                    db2.close();
                    callback();
              });
      
            });
          },function(err){
            // All tasks are done now
            // console.log(results);
            res.render('search',{searchresults:results,
              name:req.user.name,
              searchfor:tag});
          }
        );
      
      
    client.close();

    // // console.log(results);
    // res.render('search',{
    //   searchresults:results,searchfor : tag
    // });
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
        if(result.phone)phone = result.phone;
      }
      catch(e){};
      try{
        if(result.name)name = result.name;
      }
      catch(e){
        console.log('No name');
      };
      try
      {
        if(result.mail)mail = result.email;
      }
      catch(e){};
      try
      {
        if(result.designation)designation = result.designation;
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
      try
      {
        if(user_about)user_about = result.user_about;
      }
      catch(e){console.log('Lol about');};
        res.render('dashboard',{
        name:req.user.name,
        // title : req.user.username,
        username : req.user.username,
        mail : mail,
        user_about:user_about,
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
      // console.log(result);
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
    email : req.body.mail,
    user_about : req.body.user_about,
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
  <center>
  <div style = "background:#EAFAF1;width:60%;">
  <h3 style="font-size:40px;color: black;padding-top: 20px;">Contact Details</h3>
  <style>
    td{
      padding : 10px;
      width: 5%;
      font-size:20px;
    }
  </style>
<div style="background:#EAFAF1;">
  <table style="padding-bottom:30px;padding-right: 10px;padding-left: 10px;">
    <tr style="background: #EAEDED;">
      <td>
        Name
      </td>
      <td>
        ${req.body.name}
      </td>
    </tr>
    <tr style="background: white;">
      <td>
        Company
      </td>
      <td>
        ${req.body.company}
      </td>
    </tr>
    <tr style="background: #EAEDED;">
      <td>
        Mail Id
      </td>
      <td>
        ${req.body.email}
      </td>
    </tr>
    <tr style="background: white;">
      <td>
        Phone Number
      </td>
      <td>
        ${req.body.phone}
      </td>
    </tr>
    <tr style="background: #EAEDED;">
      <td>
        Message
      </td>
      <td>
        ${req.body.message}
      </td>
    </tr>
  </table>
</div>
</div>
</center>
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