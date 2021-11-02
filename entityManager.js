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
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_bricks  : [],


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
    this._categories = [this._bricks];
},

init: function() {
    //this._generateRocks();
    //this._generateShip();
},

generateBrick : function(descr) {
    this._bricks.push(new Brick(descr));
},

makeWalkway : function() {
    console.log("makewalkaway");
    var size = Brick.prototype.getSize();

    var startX = 0 + size.width;
    var startY = 480;

    // bottom 
    for (var i = 0; i < g_canvas.width/size.width-1; i++) {
        this.generateBrick({cx : startX, cy : startY});
        startX += size.width;
        if (i > 8 && i % 3 ==0) startY -= 3;
    }

    // Middle
    // takes in width of brick x & y of where to start,
        // length of floor, and wheter it should go up or down
    this.makeFloor(size.width, 35, 400, 20, "+");
    this.makeFloor(size.width, 90, 350, 20,"-");
    this.makeFloor(size.width, 38, 260, 20,"+");
    this.makeFloor(size.width, 91, 200, 20, "-");


    // top
    startX = 30;
    startY = 130;
    for (var i = 0; i < 20; i++) {
        this.generateBrick({cx : startX, cy : startY});
        startX += size.width;
        if (i > 11 && i % 3 ==0) startY += 3;
    }

    startX = 170;
    startY = 90; 
    // where the princess is
    for (var i = 0; i < 6; i++) {
        this.generateBrick({cx : startX, cy: startY});
        startX += size.width;
    }
    
},
    

makeFloor : function(width, startX, startY, length ,c) {
    console.log("start " + startX);
    for (var i = 0; i < length; i++) {
        this.generateBrick({cx : startX, cy : startY});
        startX += width;
        
        if (i % 3 ==0) {
            if (c ==="+")    startY += 3;
            else             startY -= 3;
        }
    }
            
    
},

update: function(du) {

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
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

