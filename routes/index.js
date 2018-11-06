var express = require('express');
var router = express.Router();
var resume = require('../answers.json');


router.get('/', function(req, res, next) {

  //console.log(req.query);

  if(resume[req.query.q] !== undefined)
  	res.send(resume[req.query.q]); 
  else if (req.query.q === 'Puzzle') {
  	//console.log(extractPuzzle(req.query.d));
  	res.send(solvePuzzle(extractPuzzle(req.query.d)));
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

/*

@param puzzle - 2D array representing the grid puzzle
ex: 
		= - - -
		> - - -
		- > - -
		< - - - 

@return a string containg the solved puzzle for sending as response
ex: 
	"ABCD\nA=<<>\nB>=<>\nC>>=>\nD<<<="		


Solving the puzzle takes 4 steps

Step 1 - You are given 4 values, each at position x,y
		 For each value except '=' swap the x,y indexes and for that new position set its value
		 to the opposite sign. 
		= < - >
		> - < -
		- > - -
		< - - -

Step 2 - The values for any position where x = y, will always be '='
		= < - >
		> = < -
		- > = -
		< - - =	

Step 3 - For each row take the initial value that was given at the start of the puzzle
		 and fill the remaining empty positions with said value for the corresponding row.
		 If the initial value for a row is '=' skip that row.
		= < - >
		> = < >
		> > = >
		< < < =	

Step 4 - There should only be 1 empty position A at x,y
		 Swap the x,y indexes and for that new position take its value and fill in the 
		 the original empty position with the opposite operator.
		= < < >
		> = < >
		> > = >
		< < < =			 

*/
function solvePuzzle(puzzle){
	//console.log(puzzle);
	var givenRowValues = {};

	//find the 3 given operators
	for(var row = 0; row < puzzle.length; row++)
	{
		for(var col = 0; col < puzzle[row].length; col++)
		{
			if(puzzle[row][col] !== '-')
			{
				var rowObj = {};
				rowObj['value'] = puzzle[row][col];
				rowObj['location'] = {'row' : row, 'col' : col};
				givenRowValues[row] = rowObj;
				break;
			}
		}		
	}
	//console.log(givenRowValues);
	

	//assign the opposite values for given 3
	for(var i = 0; i < Object.keys(givenRowValues).length; i++)
	{
		var row = givenRowValues[i].location.row;
		var col = givenRowValues[i].location.col;

		var operator = getOppositeComparisonOperator(puzzle[row][col]);

		if(operator !== undefined)
			puzzle[col][row] = operator;
	}
	//console.log(puzzle);


	//fill in the = operator
	puzzle[0][0] = '=';
	puzzle[1][1] = '=';
	puzzle[2][2] = '=';
	puzzle[3][3] = '=';
	//console.log(puzzle);

	//fill in 5 of the remaining 6 left
	for(var row = 0; row < puzzle.length; row++)
	{
		for(var col = 0; col < puzzle[row].length; col++)
		{
			if(puzzle[row][col] === '-')
			{
				var operator = givenRowValues[row]['value'];

				if(operator !== '=')
					puzzle[row][col] = operator;
			}
		}
	}	
	//console.log(puzzle);

	//fill in the last value in puzzle
	var lastRow = "";
	var lastCol = "";
	for(var row = 0; row < puzzle.length; row++)
	{
		var lastFound = false;

		for(var col = 0; col < puzzle[row].length; col++)
		{
			if(puzzle[row][col] == '-')
			{
				lastRow = row;
				lastCol = col;
				lastFound = true;
				break;
			}
		}
		if(lastFound)
			break;
	}	

	puzzle[lastRow][lastCol] = getOppositeComparisonOperator(puzzle[lastCol][lastRow]);

	puzzleStr = " ABCD\n";
	puzzleStr += "A" + puzzle[0].join("") + "\n";
	puzzleStr += "B" + puzzle[1].join("") + "\n";
	puzzleStr += "C" + puzzle[2].join("") + "\n";
	puzzleStr += "D" + puzzle[3].join("") + "\n";
	
	//console.log(puzzleStr);


	return puzzleStr;

}

function getOppositeComparisonOperator(operator){
	if(operator === '>')
		return '<';
	else if(operator === '<')
		return '>';
	else
		return undefined;
}

module.exports = router;
