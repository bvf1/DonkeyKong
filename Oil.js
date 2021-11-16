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
    this._scale = 1;
    // Again, the image is a bit wonky.

    this._width = this.sprite.width;
    this._height = this.sprite.height;

    spatialManager.register(this);   

};

Oil.prototype = new Entity();
Oil.prototype.tag = "Oil";
Oil.prototype.version = 0;
Oil.prototype.time = 0;



// Initial, inheritable, default values

// HACKED-IN AUDIO (no preloading)
// how to use sound not relevent here
/*Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
this.warpSound.play();*/
    


Oil.prototype.getRadius = function () {
    return this._width/2;
};

Oil.prototype.getSize = function() {
    return { 
        width : this._width, 
        height : this.height
    }

};

Oil.prototype.getPos = function() {
    return {
        posX : this.cx,
        posY : this.cy
    }
}

Oil.prototype._draw = function(ctx) {
    var imageWidth = this._width/2;
    var sourceX = imageWidth*this.version;

   // this.sprite.drawPartialImage(ctx, this._width, this._height, 
  //                               this._width*this.version, this._height,
    //                             this.cx, this.cy, this._width/2, this._height)
    this.sprite.drawPartialImage(ctx, sourceX, 0, imageWidth, this._height, 
                                 this.cx-24, this.cy-38, 50, 60);
}

Oil.prototype.update = function (du) {
    this.time += du;



    if (this.time > 5) {

        this.time = 0;
        this.version +=1;

        if (this.version === 2) {
            this.version = 0;
        }
    }
    
};

Oil.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale; // Image is a bit wonky, might have to make it prettier later
    this._draw(ctx);
   // this.sprite.drawWrappedCentredAt( ctx, this.cx, this.cy, this.rotation );
    
    this.sprite.scale = origScale;
};