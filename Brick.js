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

    this._width = this.sprite.width;
    this._height = this.sprite.height;

    spatialManager.register(this);   

};

Brick.prototype = new Entity();


// Initial, inheritable, default values
Brick.prototype.rotation = 0;
Brick.prototype.cx = 200;
Brick.prototype.cy = 200;
Brick.prototype.tag = "Brick";

// HACKED-IN AUDIO (no preloading)
// how to use sound not relevent here
/*Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
this.warpSound.play();*/
  
    
Brick.prototype.update = function (du) {

    
};


Brick.prototype.getSize = function() {
    return { 
        width : g_sprites.brick.width, 
        height : g_sprites.brick.height
    }

};

Brick.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};

