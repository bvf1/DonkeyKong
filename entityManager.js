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
    this._categories = [this._barrels,this._barrel, this._ladders,this._bricks,this._oil];
},

init: function() {
    //this._generateRocks();
    //this._generateShip();
},

itsaMe : function() {
    this._mario = new Mario({cx : 72, cy : 460});
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
    console.log("genreratebarrel");
    this._barrel.push(new Barrel(descr));
},

generateOil : function(descr) {
    this._oil.push(new Oil(descr));
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
floor : 5,
findNearestBrick : function (posX, posY) {
    var closestBrick = null;
    var closestIndex = this._bricks.length-1;
    var closestDist = 600;

    var arr = this._bricks;
    while(this.floor !== arr[closestIndex].getFloor()) {
        closestIndex--;
    }  

   // this.floor--;
    for (var i=closestIndex; i >= 0; i--) {
        if (arr[i].getFloor()<this.floor) break;
        var thisBrick = arr[i];
        var brickPos = arr[i].getPos();
        var dist = util.dist(brickPos.posX,posX);

        if (dist < closestDist) {
            closestBrick = thisBrick;
            closestIndex = i;
            closestDist = dist;
        }

    }

  //  return { theBrick : closestBrick, theIndex : closestIndex }
        return closestBrick;

},


makeLadders : function() {
    //ugly ugly ugly
    //Floor 1
    this.generateLadder({cx : 165, cy : 474, height : 75, broken : true});
    this.generateLadder({cx : 345, cy : 465, height : 60});
    //Floor 2
    this.generateLadder({cx : 225, cy : 406, height : 75});
    this.generateLadder({cx : 105, cy : 400, height : 60});
    //Floor 3
    this.generateLadder({cx : 169, cy : 338, height : 75, broken : true});
    this.generateLadder({cx : 256, cy : 335, height : 75});
    this.generateLadder({cx : 375, cy : 329, height : 60});
    //Floor 4
    this.generateLadder({cx : 320, cy : 269, height : 90, broken : true});
    this.generateLadder({cx : 194, cy : 263, height : 75});
    this.generateLadder({cx : 109, cy : 260, height : 60});
    //Floor 5
    this.generateLadder({cx : 222, cy : 189, height : 60, broken : true});
    this.generateLadder({cx : 380, cy : 179, height : 45});
    //Top Floor
    this.generateLadder({cx : 260, cy : 124, height : 45});
    this.generateLadder({cx : 190, cy : 124, height : 150});
    this.generateLadder({cx : 160, cy : 124, height : 150});
},

makeBarrels : function() {
    // Slapping on some static barrels
    this.generateBarrels({cx : 40, cy : 589});

},

makeOil : function() {
    this.generateOil({cx : 30, cy : -53});
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

    this._kong.render(ctx);
    this._mario.render(ctx);
    this._pauline.render(ctx);
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
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

