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
Barrel.prototype.time = 0;
// barrel 
Barrel.prototype.velY = 0;
Barrel.prototype.direction = +1;
Barrel.prototype.floor = 5;
Barrel.prototype.starting = true;
Barrel.prototype.goDownLadder = false;
Barrel.prototype.laddering = false;
Barrel.prototype.ladderTime = 0;
Barrel.prototype.falling = false;
Barrel.prototype.fallingTime = 0;


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

var BARREL_SPEED = 2.5;
var GRAVITY = 0.12;

Barrel.prototype.normalMovement = function (du) {
        
    var oldVelY = this.velY;

    this.velY += GRAVITY;

    var aveVelY = (oldVelY + this.velY) / 2;
    //Need this so barrels don't fall off world in some instances
    if (this.fallingTime > du*6) {
        this.cx += this.direction*BARREL_SPEED/4*du;
    }
    if (!this.laddering && this.fallingTime < du*6) {
        this.cx += this.direction*BARREL_SPEED*du;
    }
    this.cy += aveVelY * du;

}

Barrel.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    if (this.goDownLadder && Math.random() > 0.9 && !this.laddering) this.laddering = true;
    this.normalMovement(du);

    if (this.laddering) {
        this.ladderTime += du;
    }

    this.time += du;
    if (this.time > 5) {


        this.time = 0;
        this.version += 1;

        if (this.version === 3){
            
            this.version = 0;
        }

    }
    var collision = this.isColliding();
    if (collision) {
        //Check collision with brick
        if (collision[0]) {
            if (collision[0].tag === "Brick") {
                //Stop laddering after a certain period so barrel doesn't fall through the world
                if (this.ladderTime > du*24) {
                    this.laddering = false;
                }
                //Don't clip through the floor
                if (this.cy + this.getRadius() > collision[0].getPos().posY - collision[0].getSize().height/2 && !this.laddering) {
                    this.cy = collision[0].getPos().posY - collision[0].getSize().height/2 - this.getRadius();
                }
                //Turn around after falling
                if (this.falling && this.fallingTime > du*24 && !this.starting || this.ladderTime > du*24) {
                    this.direction *= -1;
                    this.ladderTime = 0;
                }
                this.starting = false;
                this.falling = false;
                this.fallingTime = 0;
                if (!this.laddering) {
                    this.velY = 0;
                }
            }
        }
        else {
            this.falling = true;
        }
        //check collision with ladder
        var ladder;
        if (collision[1]) {
            if (collision[1].tag === "Ladder") {
                
                ladder = collision[1];
                var pos = ladder.getPos();
                var size = ladder.getSize();
                //Check if in right position above ladder and around center
                if (this.cy < pos.posY - 3*size.height/4 &&
                    this.cx > pos.posX + size.width/2 - 2 &&
                    this.cx < pos.posX + size.width/2 + 2 &&
                    !this.laddering) {
                    this.goDownLadder = true;
                }
                else {
                    this.goDownLadder = false;
                }
            }
        }
        else {
            this.goDownLadder = false;
        }
        
        //check collsion with oil barrel
        if (collision[2]) {
            
            if (collision[2].tag === "Oil") {
                this.kill();
            }
        }
        //check collision with hammer
        if (collision[4]) {
            if (collision[4].tag === "Hammer") {
                collision[4].dies();
                this.kill();
            }
        }
    }
    else {
        this.falling = true;
        this.fallingTime += du;
        this.goDownLadder = false;
    }


    //change version of barrel
    if (!this._isDeadNow) {
        this.cycleVersions(du, 0.1, 0, 3);
    }
    else return entityManager.KILL_ME_NOW;
        
    
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
