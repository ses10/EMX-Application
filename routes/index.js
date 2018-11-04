var express = require('express');
var router = express.Router();
var resume = require('../answers.json');


/* GET home page. */
router.get('/', function(req, res, next) {

  //console.log(req.query);

  if(resume[req.query.q] !== undefined)
  	res.send(resume[req.query.q]); 
  
  res.send('OK');	
  

});

module.exports = router;
