const keySecret = "sk_test_CXosaxEOHMENrsmMbwBvGU5Q";
var express = require('express');
var router = express.Router();
const stripe = require("stripe")(keySecret);


//var dataCardBike = [];
var loginValid = "john@gmail.com";
var passwordValid = "azerty";

var dataBike = [
                  {name: "Model BIKO45", url:"/images/bike-1.jpg", price: 679},
                  {name: "Model ZOOK7", url:"/images/bike-2.jpg", price: 799},
                  {name: "Model LIKO89", url:"/images/bike-3.jpg", price: 839},
                  {name: "Model GEWO", url:"/images/bike-4.jpg", price: 1206},
                  {name: "Model TITAN5", url:"/images/bike-5.jpg", price: 989},
                  {name: "Model AMIG39", url:"/images/bike-6.jpg", price: 599}
               ];
/* GET home page. */
router.get('/', function(req, res, next) {

  //console.log(req.session.dataCardBike);
  if(req.session.dataCardBike == undefined) {
    req.session.dataCardBike = [];
  }
  if(req.session.isLogin == undefined) {
    req.session.isLogin = false;
  }

  res.render('index', {dataBike: dataBike, isLogin: req.session.isLogin});
});

router.post('/add-card', function(req, res, next) {
  console.log(req.body);
  req.session.dataCardBike.push(req.body);
  res.render('card', { dataCardBike: req.session.dataCardBike});
})

router.post('/update-card', function(req, res, next) {
  console.log(req.body);
  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;
  res.render('card', { dataCardBike: req.session.dataCardBike  });
})

router.get('/delete-card', function(req, res, next) {
  console.log(req.body);
  req.session.dataCardBike.splice(req.query.position, 1);
  res.render('card', { dataCardBike : req.session.dataCardBike });
})

router.get('/card', function(req, res, next) {

  /*var totalCmd = 0;
  for(var i=0; i<dataCardBike.length; i++) {
    dataCardBike[i].total =  dataCardBike[i].price * dataCardBike[i].quantity;
    totalCmd = totalCmd + dataCardBike[i].total;
  }*/
  res.render('card', { dataCardBike: req.session.dataCardBike });
});

router.get('/login', function(req, res, next) {
  res.render('login-form', {msg: null});
})

router.post('/login', function(req, res, next) {
  console.log(req.body.email);
  console.log(req.body.password);
  var isValid;
  if(req.body.email ==  loginValid && req.body.password == passwordValid) {
    req.session.isLogin = true;
    res.render('index', {dataBike: dataBike, isLogin: req.session.isLogin});
  } else {
    req.session.isLogin = false;
    res.render('login-form', {msg: "erreur de login"});

  }
})

router.get('/logout', function(req, res, next) {
  req.session.isLogin = false;
  req.session.dataCardBike = [];
  res.render('index', {dataBike: dataBike, isLogin: req.session.isLogin});
})

router.post("/checkout", (req, res) => {

  var totalCmd = 0;
  for(var i=0; i<req.session.dataCardBike.length; i++) {
    totalCmd = totalCmd + (req.session.dataCardBike[i].price * req.session.dataCardBike[i].quantity);
  }
  totalCmd = totalCmd * 100;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount:totalCmd,
      description: "Sample Charge",
         currency: "eur",
         customer: customer.id
    }))
  .then(charge => res.render("cmd-confirm"));
});

module.exports = router;
