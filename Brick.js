// ==========
// Brick STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Brick(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.brick;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    spatialManager.register(this);   

};

Brick.prototype = new Entity();


// Initial, inheritable, default values
Brick.prototype.rotation = 0;
Brick.prototype.cx = 200;
Brick.prototype.cy = 200;
Brick.prototype.velX = 0;
Brick.prototype.velY = 0;
Brick.prototype.launchVel = 2;
Brick.prototype.numSubSteps = 1;

// HACKED-IN AUDIO (no preloading)
// how to use sound not relevent here
/*Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
this.warpSound.play();*/
  
    
Brick.prototype.update = function (du) {

    
};

Brick.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};
Brick.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
