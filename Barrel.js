// ============
// Barrel STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object

// Placeholder for now, because more spicy Barrel will be added later!
function Barrel(descr) {


    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.barrel;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this._width = this.sprite.width;
    this._height = this.sprite.height;

    spatialManager.register(this);   

};

Barrel.prototype = new Entity();
Barrel.prototype.version = 0;

// Initial, inheritable, default values

// HACKED-IN AUDIO (no preloading)
// how to use sound not relevent here
/*Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
this.warpSound.play();*/


Barrel.prototype.getSize = function () {
    return { 
        width : this._width, 
        height : this.height
    }

};

Barrel.prototype.getRadius = function () {
    return this._width/2;
};



Barrel.prototype._draw = function (ctx) {
    var imageWidth = (this._width/4);
    var imageHeight = this._height/2;
    var sourceX;
    var sourceY;
    if (this.version == 0) {
        sourceX = 0;
        sourceY = 0;
    }
    else if (this.version == 1) {
        sourceX = imageWidth*1;
        sourceY = 0;

    }
    else if (this.version == 2) {
        sourceX = imageWidth*1;
        sourceY = imageHeight*1;

    }
    else if (this.version == 3) {
        sourceX = 0;
        sourceY = imageHeight*1;
    }
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, this.cx-imageWidth, this.cy-imageHeight, 30,30);
   // ctx.fillRect(this.cx, this.cy,3,3); // fill in the pixel at (10,10)
}//    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, this.cx, this.cy, 100,100);

/*Barrel.prototype.update = function (du) {
   // console.log("this version " + this.version);
    this.cx += 5*du;
    this.version = this.getVersion(du, 90, this.version, 3)

};*/


Barrel.prototype.time = 0;
Barrel.prototype.update = function (du) {
    spatialManager.unregister(this);

  //  console.log(this.cx);
    this.time += du;
    if (this.time > 5) {
        this.cx += 0.1*SECS_TO_NOMINALS*du;
        var closestBrick = entityManager.findNearestBrick(this.cx, this.cy);

        console.log("x " + this.cx + " y " + this.cy);
       // console.log(closestBrick);
        this.cy = closestBrick.getPos().posY-this._height/2-closestBrick.getSize().height/2.

        this.time = 0;
        this.version += 1;

        if (this.version == 3){
            
            this.version = 0;
        }
    }
    spatialManager.register(this);

} 

Barrel.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale; 

    this._draw(ctx);
    this.sprite.scale = origScale;
};
       // Sprite.prototype.drawPartialImage = function (ctx, sx, sy, sWidth, sHeight, cx, cy, dWidth, dHeight) {
//
