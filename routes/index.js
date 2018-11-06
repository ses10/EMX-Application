var express = require('express');
var router = express.Router();
var resume = require('../answers.json');


router.get('/', function(req, res, next) {

  //console.log(req.query);

  if(resume[req.query.q] !== undefined)
  	res.send(resume[req.query.q]); 
  else if (req.query.q === 'Puzzle') {
  	console.log(extractPuzzle(req.query.d));

  }
  res.send('OK');	
  

});

/*
Extract the puzzle from the following string format 
"Please solve this puzzle: ABCD A=--- B---> C<--- D>---"

Returns an 2D array representing the grid puzzle
ex:
		= - - -
		- - - >
		< - - -
		> - - - 
*/
function extractPuzzle(str){
	var puzzleObj = str.match(/A[-=<>]{4}\nB[-=<>]{4}\nC[-=<>]{4}\nD[-=<>]{4}\n/);
	//console.log(puzzleObj);
	puzzleStr = puzzleObj[0].replace(/[A-Z]/g, "")
  	puzzleArr = puzzleStr.split("\n");
  	puzzle = [];

  	for(var i = 0; i < puzzleArr.length - 1; i++)
  	{
  		//console.log(puzzleArr[i].split(""));
  		puzzle.push(puzzleArr[i].split(""));
  	}

  	return puzzle;
}

function solvePuzzle(){



}

module.exports = router;
