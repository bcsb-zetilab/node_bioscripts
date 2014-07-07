node_scripts
============

    _-___         ,     ,,       ,,
        /        ||   ' ||   _   ||
       /   _-_  =||= \\ ||  < \, ||/|,
     =/=  || \\  ||  || ||  /-|| || ||
     /    ||/    ||  || || (( || || |'
    /-__- \\,/   \\, \\ \\  \/\\ \\/

Bioinformatics analysis helper scripts in Node.js


Requirements:
-------------
1. Node.js version 0.10.x


Notes:
-----
1. Each helper scripts are standalone in separated folders.
2. Require Node.js version 0.10.x
3. To install, enter helper script folder, run `npm install`
4. Enjoy!

Scripts:
--------
1. node-extract

    node-extract.js <kkloke86@zetilab.org>
    --------------------------------------------
    Usage:
    node node-extract.js <FILE:Fasta ID List> <FILE: FASTA> <FILE: Extract to>
    
    Example (included):
    node node-extract.js test.id.txt test.fasta test.out
