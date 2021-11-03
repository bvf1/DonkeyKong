// ==========
// Oil STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object

// Placeholder for now, because more spicy barrels will be added later!
function Oil(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.oil;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1.7;
    // Again, the image is a bit wonky.

    this._width = this.sprite.width;
    this._spriteHeight = this.sprite.height;

    spatialManager.register(this);   

};

Oil.prototype = new Entity();


// Initial, inheritable, default values

// HACKED-IN AUDIO (no preloading)
// how to use sound not relevent here
/*Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
this.warpSound.play();*/
    
Oil.prototype.update = function (du) {

    
};


Oil.prototype.getSize = function() {
    return { 
        width : this._width, 
        height : this.height
    }

};

Oil.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale; // Image is a bit wonky, might have to make it prettier later
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};