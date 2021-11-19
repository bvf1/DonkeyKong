/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//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/d
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_bricks  : [],
_ladders : [],
_barrels : [],
_barrel  : [],
_oil     : [],
_hammer  : [],
_mario   : null,
_kong    : null,
_pauline : null,


// "PRIVATE" METHODS


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._barrels, this._ladders,this._barrel,this._bricks, this._oil, this._hammer];
},

init: function() {
    //this._generateRocks();
    //this._generateShip();
},

itsaMe : function() {
    this._mario = new Mario({cx : 72, cy : 460});
   // this._mario = new Mario({cx : 400, cy : 80});

},

itsaDonkey : function() {
    this._kong = new Kong({cx : 59, cy : 34});
},

itsaPauline : function() {
    this._pauline = new Pauline({cx: 190, cy: 55});
},

generateBrick : function(descr) {
    this._bricks.push(new Brick(descr));
},

generateLadder : function(descr) {
    this._ladders.push(new Ladder(descr));
},

generateBarrels : function(descr) {
    this._barrels.push(new Barrels(descr));
},

generateBarrel : function(descr) {
    this._barrel.push(new Barrel(descr));
},

generateOil : function(descr) {
    this._oil.push(new Oil(descr));
},

generateHammer : function(descr) {
    this._hammer.push(new Hammer(descr))
},

makeHammers : function () {
    entityManager.generateHammer({cx : 70, cy : 170});
    entityManager.generateHammer({cx : 350, cy : 370});
},

makeWalkway : function() {
    console.log("makewalkaway");
    var size = Brick.prototype.getSize();

    var startX = 0;
    var startY = 480;

    // bottom 
    for (var i = 0; i < g_canvas.width/size.width+1; i++) {
        this.generateBrick({cx : startX, cy : startY, floor : 0});
        startX += size.width;
        if (i > 9 && i % 3 ==0) startY -= 3;
    }

    // Middle
    // takes in width of brick x & y of where to start,
        // length of floor, and whether it should go up or down
    this._makeFloor(size.width, 0, 400, 21, "+",1);
    this._makeFloor(size.width, 60, 350, 23,"-",2);
    this._makeFloor(size.width, 0, 260, 22,"+",3);
    this._makeFloor(size.width, 70, 205, 22, "-",4);


    // top
    startX = 0;
    startY = 130;
    for (var i = 0; i < 21; i++) {
        this.generateBrick({cx : startX, cy : startY, floor : 5});
        startX += size.width;
        if (i > 11 && i % 3 ==0) startY += 3;
    }

    startX = 220;
    startY = 90; 
    // where the princess is
    for (var i = 0; i < 5; i++) {
        this.generateBrick({cx : startX, cy: startY, floor : 6});
        startX += size.width;
    }
    
},
    

_makeFloor : function(width, startX, startY, length ,c, floor) {
    console.log("start " + startX);
    for (var i = 0; i < length; i++) {
        this.generateBrick({cx : startX, cy : startY, floor : floor});
        startX += width;
        
        if (i % 3 ==0) {
            if (c ==="+")    startY += 3;
            else             startY -= 3;
        }
    }
            
},

// checks if brick is the last brick before barrel falls down
isEndOfFloor : function (brick, barrel) {
    var compBrick = null;
    var brickFloor = brick.theBrick.getFloor();
    var brickPosX = brick.theBrick.getPos().posX;

    // for floor with odd numbers we go through floor tiles to see if
    //   nearest tile is the end of floor
    if (brickFloor % 2 === 1 && 
        barrel.getPos().posX >
            // check if barrel is at end of brick
            brickPosX + brick.theBrick.getSize().width/2) {
        for (var i = this._bricks.length-1; i >= 0; i--) {
            if (this._bricks[i].getFloor() !== brickFloor) continue;
            compBrick = this._bricks[i];
            if (compBrick.getSpatialID() === brick.theBrick.getSpatialID())  {
                if (this._bricks[i+1].getFloor() === brickFloor) return false;
                break;
            }

        }
    }

    // checks if the brick with lower number is on a lower floor
    else {
        if (this._bricks[brick.index-1].getFloor() < brickFloor) {
            // check if barrel is at beginning of brick
            if (barrel.getPos().posX < 
                brickPosX - brick.theBrick.getSize().width/2) return true;
            else return false;
        }
        else return false;
    }
    return true;
 
},

// findNearestBrick for y coordinates of barrell
    // returns closest index as well for isEndOfFloor
findNearestBrick : function (posX, posY, floor) {
    var closestBrick = null;
    var closestIndex = this._bricks.length-1;
    var closestDist = 600;

    var arr = this._bricks;

    while(floor !== arr[closestIndex].getFloor()) {
        closestIndex--;
    }  

    for (var i=closestIndex; i >= 0; i--) {
        var thisBrick = arr[i];
        var brickPos = arr[i].getPos();
        var dist = util.dist(brickPos.posX,posX);

        if (dist < closestDist) {
            closestBrick = thisBrick;
            closestIndex = i;
            closestDist = dist;
        }
        if (i === 0) break;
        if (arr[i-1].getFloor()<floor) break;


    }

        return { theBrick : closestBrick, index : closestIndex};

},


makeLadders : function() {
    //ugly ugly ugly
    //Floor 1
    this.generateLadder({cx : 165, cy : 474, height : 85, broken : true});
    this.generateLadder({cx : 345, cy : 467, height : 69});
    //Floor 2
    this.generateLadder({cx : 225, cy : 406, height : 85});
    this.generateLadder({cx : 105, cy : 400, height : 73});
    //Floor 3
    this.generateLadder({cx : 169, cy : 338, height : 90, broken : true});
    this.generateLadder({cx : 256, cy : 335, height : 80});
    this.generateLadder({cx : 375, cy : 329, height : 68});
    //Floor 4
    this.generateLadder({cx : 320, cy : 272, height : 103, broken : true});
    this.generateLadder({cx : 194, cy : 266, height : 89});
    this.generateLadder({cx : 109, cy : 261, height : 78});
    //Floor 5
    this.generateLadder({cx : 222, cy : 190, height : 80, broken : true});
    this.generateLadder({cx : 380, cy : 181, height : 61});
    //Top Floor
    this.generateLadder({cx : 260, cy : 127, height : 55});
    this.generateLadder({cx : 190, cy : 124, height : 150});
    this.generateLadder({cx : 160, cy : 124, height : 150});
},

makeBarrels : function() {
    // Slapping on some static barrels
    this.generateBarrels({cx : 40, cy : 589});

},
reset : function() {
    for (var i = 0; i < this._barrel.length; i++) {
        this._barrel[i].kill();
    }
    
    for (var i = 0; i < this._hammer.length; i++) {
        this._hammer[i].kill();
    }

},




update: function(du) {
    this._kong.update(du);
    this._mario.update(du);
    this._pauline.update(du);
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;
        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
    

},

render: function(ctx) {

    var debugX = 10, debugY = 100;


    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
    this._kong.render(ctx);
    this._mario.render(ctx);
    this._pauline.render(ctx);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

