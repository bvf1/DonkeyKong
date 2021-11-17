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
Barrel.prototype.tag = "Barrel"
Barrel.prototype.version = 0;
Barrel.prototype.time = 0;
// barrel 
Barrel.prototype.direction = +1;
Barrel.prototype.floor = 5;
Barrel.goDownStairs = false;


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
    return this._width/4-2;
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
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, 
                                 this.cx-imageWidth, this.cy-imageHeight, 30,30);
}



Barrel.prototype._moveBarrelDown = function(brick, barrel) {
     barrel._cy = brick.theBrick.getPos().posX;
}



Barrel.prototype.normalMovement = function (du) {
    this.cx +=  this.direction*0.1*SECS_TO_NOMINALS*du;
        
    var closestBrick = entityManager.findNearestBrick(this.cx, this.cy, this.floor);
   
    if (entityManager.isEndOfFloor(closestBrick, this)) {
        this.floor -= 1;
        this.direction *= -1
        closestBrick = entityManager.findNearestBrick(this.cx, this.cy,this.floor);
        this._moveBarrelDown(closestBrick, this);
    }

    this.cy = closestBrick.theBrick.getPos().posY-this._height/2-closestBrick.theBrick.getSize().height/2.

}

Barrel.prototype.downMovement = function (du) {

}

Barrel.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    this.time += du;
    if (this.time > 5) {

        if (this.goDownStairs) this.downMovement(du);
        this.normalMovement(du);


        this.time = 0;
        this.version += 1;

        if (this.version === 3){
            
            this.version = 0;
        }

    }


    var collision = this.isColliding();
    if (collision) {
        //check collision with ladder
        var ladder;
        if (collision[1]) {
            if (collision[1].tag === "Ladder") {
                
                ladder = collision[1];
                if (Math.abs(this.cx - ladder.getPos.getX) - 1) {
                    this.goDownStairs = true;
                }
            }
        }
        //check collsion with oil barrel
        if (collision[2]) {
            
            if (collision[2].tag === "Oil") {
                this.kill();
            }
        }
        if (this._isDeadNow) return entityManager.KILL_ME_NOW;
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
