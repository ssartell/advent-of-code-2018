var R = require('ramda');
var fs = require('fs');
var Stopwatch = require("node-stopwatch").Stopwatch;
var ansi = require('ansi');
var cursor = ansi(process.stdout);

function pad(digit, width, char) {
  char = char || '0';
  digit = digit + '';
  return digit.length >= width ? digit : new Array(width - digit.length + 1).join(char) + digit;
}

function run(day, part, shouldRunTests) {
    var log = 'day ' + day + ', part ' + part

    day = pad(day, 2);
	
	var input = fs.readFileSync('day' + day + '/input.txt', 'utf8');
	var solution = require('./day' + day + '/part' + part);

    var stopwatch = Stopwatch.create();

	stopwatch.start();
    var answer = solution(input);
    stopwatch.stop();
    
    log += ' : ' + stopwatch.elapsed.seconds + 's'
    
    console.log(log);
	console.log(answer);
}

module.exports = run;