var fs = require('fs'),
	LineByLineReader = require('line-by-line'),
	figlet = require('figlet'),
	exec = require('child_process').exec;


if(process.argv[2] == undefined){
   promptFunction();
   console.log("[ERROR] Missing Fasta ID List as param1!");
   process.exit(1);
}

if(process.argv[3] == undefined){
   promptFunction();
   console.log("[ERROR] Missing FASTA File as param2!");
   process.exit(1);
}

var outfile;
var infofile;
if(process.argv[4] == undefined){   
   outfile = 'extract-' + process.argv[3];
   infofile = 'info-' + process.argv[3];
   console.log("[INFO] Not specify extract to, assume to be the same path.");
   process.exit(1);
} else {
	outfile = process.argv[4];
	infofile = 'info-' + process.argv[4];
}

function promptFunction(){
   var msg = [
	  'node-extract.js <kkloke86@zetilab.org>' + "\n",
	  '--------------------------------------------' + "\n",
	  'Usage:' + "\n",
	  'node node-extract.js <FILE:Fasta ID List> <FILE: FASTA> <FILE: Extract to>'
   ].join("");
   
   var printed = false;
   
	figlet('Zetilab', {
		font: 'Gothic',
		horizontalLayout: 'full',
		verticalLayout: 'default'
	}, function(err, data) {
		if (err) {
			console.dir(err);
			return;
		}
		console.log(data);
		console.log(msg);
		printed = true;		
	});
	
	while(!printed) {
		require('deasync').runLoopOnce();
	}
}

var extractIds = fs.readFileSync(process.argv[2], "utf8");
var seqlib = [];
var extractlib = [];
var nonExtractlib = [];
var reading = true;

var extractCallback = function(seqlib, extractIds){
	var ids = extractIds.split("\n");
	for(var i=0; i<ids.length; i++){
		var searchKey = ids[i].trim();
		if(seqlib[searchKey] != undefined){
			extractlib.push(seqlib[searchKey]);
		} else {
			if(searchKey != ''){
				nonExtractlib.push(searchKey);
			}
		}
	}
	
	//Selfie...
	var figlet = require('figlet');

	figlet('Zetilab', {
		font: 'Gothic',
		horizontalLayout: 'full',
		verticalLayout: 'default'
	}, function(err, data) {
		if (err) {
			console.dir(err);
			return;
		}
		console.log(data)
		
		fs.writeFileSync(infofile, nonExtractlib.join("\n"));
		console.log('[INFO] ' + nonExtractlib.length + ' id not found, log into ' + infofile);
			
		fs.writeFileSync(outfile, extractlib.join(''));
		console.log('[INFO] Done extractions of ' + extractlib.length + ' IDs.');		
		
	});

}

console.log('[INFO] Reading FASTA...');
readLargeFile(process.argv[3], extractIds, extractCallback);

//Helper function...

function readLargeFile(source, extractIds, extractCallback){
	var lr = new LineByLineReader(source);
	var inter = "";
	var interseq = "";
	lr.on('error', function (err) {
		// 'err' contains error object
		console.log('[ERROR] Cannot read ' + source);
	});

	lr.on('line', function (line) {
		// 'line' contains the current line without the trailing newline character.
		if(line == ""){
			//Do nothing
		} else {
		
			inter += line + "\n";
			interseq = inter.split('>');
			if(interseq.length > 1){
			
				if(interseq[0] != ""){
					var elems = interseq[0].split("\n");
					if(elems.length > 1){
						var seqkey = elems[0];
						if(seqkey != ""){
							seqlib[seqkey] = '>' + interseq[0];
							//seqlib.push('>' + interseq[0]);
						}
					}
				}
				
				//Remaining...
				inter = "";
				for(var i=1; i<interseq.length; i++){
					inter += interseq[i];
				}				
			}
			
		}
	});

	lr.on('end', function () {
		// All lines are read, file is closed now.
		
		// Include the last part as well
		var elems = inter.split("\n");
		if(elems.length > 0){
			var seqkey = elems[0];
			if(seqkey != ""){
				seqlib[seqkey] = '>' + inter;
			}
		}
		
		var seqsize=0;
		for(seqkey in seqlib){
			seqsize++;
		}
		
		console.log('[INFO] Done reading ' + source);
		console.log('[INFO] ' + seqsize + " of FASTA detected.");
		
		extractCallback(seqlib, extractIds);

	});
}

