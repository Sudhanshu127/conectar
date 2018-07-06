const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
//const MongoClient = require('mongodb').MongoClient;
//const url = "mongodb://localhost:27017/";
//some stuff is static else will be passed either by having a route js file or add here only
//we also need to make a function to upload image file in data base by gridfs in .chunks extension and then call it in same way
/*MongoClient.connect(url, function(err, db) {
  if (err) console.log("error recieved");
  const dbo = db.db("users");
  const userName = "username";
  dbo.collection("user").findOne({"username":userName}, function(err, result) {
    if (err) console.log('Error detected');
    console.log(result);
    const phone = result.phone;
    const mail = result.mail;
    const designation = result.designation;
    const present = result.present;
    const tags = result.tags;
    console.log(result);
    db.close();
  });
});*/
app.get('/', ensureAuthenticated,function(req, res) {
    res.render('dashboard',{
      title : 'vishal260700',
      username : 'vishal260700',
      mail : 'vishal260700@gmail.com',
      phone : '9413605678',
      designation : 'student',
      cc : 'IIT Kanpur',
      t1: 'Web Development',
      t2 : 'App Development',
      t3 : 'Block Chain Development',
      f1 : 'Vipul Shankhpal',
      f2 : 'Ayush Soneria',
      f3 : 'Sudhanshu Bansal',
      f4 : 'Jayesh'
    });
});
app.get('/tag',ensureAuthenticated,function(req,res){
  res.render('tagging',{
    username : 'vishal260700'
  });//add the function of inserting data in the database collection following userschema
});
app.get('/team',ensureAuthenticated,function(req,res){
  res.render('team',{
    team : 'Conectar-Family'
  });//add the function of inserting data in the database collection following userschema
});
app.get('/chat', ensureAuthenticated,function (req, res) {
 res.render('chat',{
  username : 'vishal260700'//will add a token/ session here
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
      <li>Name: ${req.name}</li>
      <li>Company: ${req.company}</li>
      <li>Email: ${req.email}</li>
      <li>Phone: ${req.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.message}</p>
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