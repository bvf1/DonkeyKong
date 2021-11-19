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
Barrel.prototype.ladderEnd = false;
Barrel.prototype.falling = false;
Barrel.prototype.fallingTime = 0;
Barrel.prototype.specialBarrel = false;


// Initial, inheritable, default values

// HACKED-IN AUDIO (no preloading)
// how to use sound not relevent here
/*Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");
this.warpSound.play();*/


Barrel.prototype.getSize = function () {
    if (!this.laddering) return null;
    return {
        width : this._width-25,
        height: this._height
    };
}

Barrel.prototype.getRadius = function () {
    return this._width/4-5;
};



Barrel.prototype._draw = function (ctx) {
    var imageWidth;
    var imageHeight = this._height/2;
    var sourceX;
    var sourceY;
    var diffx = 0;
    var diffw = 1;

    imageWidth = (this._width/2);
    if (this.version == 0) {
        imageWidth = (this._width/4);
        
        sourceX = 0;
        sourceY = 0;
    }
    else if (this.version == 1) {
        imageWidth = (this._width/4);
        sourceX = imageWidth*1;
        sourceY = 0;

    }
    else if (this.version == 2) {
        imageWidth = (this._width/4);
        sourceX = imageWidth*1;
        sourceY = imageHeight*1;

    }
    else if (this.version == 3) {
        imageWidth = (this._width/4);
        sourceX = 0;
        sourceY = imageHeight*1;
    }
    else if (this.version == 4) {
        imageWidth = (this._width/2);
        sourceX = imageWidth*1;
        sourceY = imageHeight*0;
        diffx = -7;
        diffw = 2.5;

    }
    else if (this.version == 5) {
        imageWidth = (this._width/2);
        sourceX = imageWidth*1;
        sourceY = imageHeight*1;
        diffx = -7;
        diffw = 2.5;
    }

    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, 
                                 this.cx-imageWidth-2+diffx, this.cy-imageHeight-3, 30*diffw,30);
   
}


var BARREL_SPEED = 2.5;
var GRAVITY = 0.12;

Barrel.prototype.normalMovement = function (du) {
        
    var oldVelY = this.velY;

    this.velY += GRAVITY;

    var aveVelY = (oldVelY + this.velY) / 2;
    //Need this so barrels don't fall off world in some instances
    if (!this.laddering && this.fallingTime > du*6 && !this.specialBarrel) {
        this.cx += this.direction*BARREL_SPEED/4*du;
    }
    if (!this.laddering && this.fallingTime < du*6) {
        this.cx += this.direction*BARREL_SPEED*du;
    }
    this.cy += aveVelY * du;

}
Barrel.prototype.switch = false;
Barrel.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;



    if (this.cy > 450) {
        this.direction = -1;
        this.specialBarrel = false;
        
    }
    if (this.specialBarrel) {
        this.laddering = true;
    }

    if (this.goDownLadder && Math.random() > 0.9 && !this.laddering) this.laddering = true;
    this.normalMovement(du);

    if (this.laddering || this.specialBarrel) {
        if (!this.switch) {this.version = 4; this.switch = true}
        
        this.ladderTime += du;

        this.cycleVersions(du,0.03,4,5);
    }
    else {
        this.cycleVersions(du, 0.1, 0, 3);

    }

    var collision = this.isColliding();
    if (collision) {
        //Check collision with brick
        if (collision[0]) {
            if (collision[0].tag === "Brick") {

                //Stop laddering after a certain period so barrel doesn't fall through the world
                if (this.ladderEnd && !this.specialBarrel) {
                    this.laddering = false;
                }
                //Don't clip through the floor
                if (this.cy + this.getRadius() > collision[0].getPos().posY - collision[0].getSize().height/2 && !this.laddering) {
                    this.cy = collision[0].getPos().posY - collision[0].getSize().height/2 - this.getRadius();
                }
                //Turn around after falling
                if (this.falling && this.fallingTime > du*20 && !this.starting || this.ladderEnd && !this.specialBarrel) {
                    this.direction *= -1;
                    this.ladderEnd = false;

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
            if (!this.laddering) {
                this.fallingTime += du;
            }
            if (this.ladderTime > 6*du && this.laddering) {
                this.ladderEnd = true;
            }
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
                collision[4].kill();
                this.kill();
                entityManager._mario.score += 100;
            }
        }
    }
    else {
        this.falling = true;
        this.fallingTime += du;
        this.goDownLadder = false;
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
