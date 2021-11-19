function Mario(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();


    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.mario;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this._width = this.sprite.width;
    this._height = this.sprite.height;

    this._realWidth = 30;
    this._realHeight = 30;

    spatialManager.register(this);   
};


Mario.prototype = new Entity();



Mario.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

Mario.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Mario.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Mario.prototype.KEY_UP = 'W'.charCodeAt(0);Mario.prototype.KEY_DOWN = 'S'.charCodeAt(0);
Mario.prototype.KEY_JUMP = ' '.charCodeAt(0);

Mario.prototype.velX = 0;
Mario.prototype.velY = 0;
Mario.prototype.grounded = false;
Mario.prototype.jumping = false;
Mario.prototype.allowClimb = false;
Mario.prototype.climbing = false;
Mario.prototype.tag = "Mario";

Mario.prototype.floor = 0;
Mario.prototype.hasHammer = false;
Mario.prototype.status = "alive";

var NOMINAL_GRAVITY = 0.12;

Mario.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
}

var NOMINAL_SPEED = 0.05;


Mario.prototype.computeWalk = function () {
    var accelX = 0;

    if (keys[this.KEY_LEFT]) {
        accelX -= NOMINAL_SPEED;
    }
    if (keys[this.KEY_RIGHT]) {
        accelX += NOMINAL_SPEED;
    }

    return accelX;
}

var JUMP_HEIGHT = 2.8;

Mario.prototype.computeJump = function () {
    var accelY = 0;

    if (keys[this.KEY_JUMP] && this.grounded && !this.jumping) {
        accelY += JUMP_HEIGHT;
        this.jumping = true;
    }
    return -accelY;
}

Mario.prototype.computeClimb = function () {
    var accelY = 0;
    if (keys[this.KEY_UP] && this.allowClimb) {
        accelY -= NOMINAL_SPEED;
        this.climbing = true;
    }
    if (keys[this.KEY_DOWN] && this.allowClimb) {
        accelY += NOMINAL_SPEED;
        this.climbing = true;
    }
    return accelY;
}



Mario.prototype.setPos = function(cx, cy) {
    this.cx = cx;
    this.cy = cy;
}
Mario.prototype.getAliveStatus = function() {
    return this.status === "alive";
}

Mario.prototype.reset = function () {
    // Remember my reset positions
    this.setPos(this.reset_cx, this.reset_cy);
}
//mario just died
Mario.prototype.dies = function () {

    this.status = "dying"
    g_stopscreen = true;
    this.timer = new util.Timer(1.3*SECS_TO_NOMINALS);

}
// stop game while mario dies
Mario.prototype.waiting = function () {
  //  this.status = "waiting"


    entityManager.reset();
    this.version = 20;
}
Mario.prototype.newLife = function () {
    this.status = "alive";
    this.version = 3;
    entityManager.makeHammers();
    this.reset();


}
Mario.prototype.timer;

Mario.prototype.update = function (du) {

    spatialManager.unregister(this);

    var accelX = this.computeWalk();
    var accelY = 0;

    accelY += this.computeClimb();
    
    if (!this.climbing) {
        accelY += this.computeGravity();
    }
    this.applyAccel(accelX, accelY, du);

    var collision = this.isColliding();
    if (collision) {
        if (collision[0]) {
            if (collision[0].tag === "Brick") {
                this.grounded = true;
                //Step onto the platforms, might need to change in order to make ladders work well
                if (this.cy + this.getRadius() > collision[0].getPos().posY - collision[0].getSize().height/2 && !this.jumping) {
                    this.cy = collision[0].getPos().posY - collision[0].getSize().height/2 - this.getRadius();
                }
                //Allow another jump and reset velocity so Mario doesn't get launched into lower orbit
                this.jumping = false;
                this.velY = 0;
            }
        }
        else {
            this.grounded = false;
        }
        if (collision[1]) {
            if (collision[1].tag === "Ladder" && !collision[1].broken) {
                this.allowClimb = true;
            }
        }
        else {
            this.allowClimb = false;
            this.climbing = false;
        }

        // Mario dies when colliding with Barrel
        if (collision[3]) {
            if (collision[3].tag === "Barrel") {

                this.dies();

            }
        }
        if (collision[4]) {
            if (collision[4].tag === "Hammer") {
                this.hasHammer = true;
                collision[4].inUse();
            }
        }

    } else {
        this.grounded = false;
        this.allowClimb = false;
        this.climbing = false;
    }

    if (this.status === "dying") {
        // shows the different dead pictures
        this.cycleVersions(du, 0.2, 19, 22);
        if (this.timer.tick(du)) {
            // mario is dead
            this.version = 23;
            g_stopscreen = true;
            this.status = "waiting";
        }

    }


   // if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    spatialManager.register(this);

}
    



var MAX_SPEED = 2.5;

Mario.prototype.applyAccel = function (accelX, accelY, du) {
    var oldVelX = this.velX;
    var oldVelY = this.velY;

    this.velX += accelX * du;
    this.velY += accelY * du;
    this.velY += this.computeJump();
    
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    //Resetting velocity when no keypress or turning around
    if (accelX === 0 || (oldVelX > 0 && accelX < 0) || (oldVelX < 0 && accelX > 0)) {
        aveVelX = 0;
        this.velX = 0;
    }
    if (this.climbing && (accelY === 0 || (oldVelY > 0 && accelY < 0) || (oldVelY < 0 && accelY > 0))) {
        aveVelY = 0;
        this.velY = 0;
    }
    //Applying max speed
    if (Math.abs(aveVelX) > MAX_SPEED) {
        aveVelX = aveVelX/Math.abs(aveVelX) * MAX_SPEED;
    }
    if (Math.abs(aveVelY) > MAX_SPEED && this.climbing) {
        aveVelY = aveVelY/Math.abs(aveVelY) * MAX_SPEED;
    }

    var nextX = this.cx + aveVelX * du;
    var nextY = this.cy + aveVelY * du;

    if (this.grounded && !this.jumping && !this.climbing) {
        aveVelY = 0;
        this.velY = 0;
    }
    //Move Mario Mario
    this.cx += aveVelX * du;
    this.cy += aveVelY * du;
}

Mario.prototype.getRadius = function () {
    return this._realHeight/2-1;
}

Mario.prototype._draw = function(ctx) {
    
    if (this.version >= 0 && this.version < 6) {
        this.drawWalking(ctx);
    }
    else if (this.version >= 6 && this.version < 12) {
        this.drawWalkingHammer(ctx);
    } 

    else if (this.version >=12 && this.version <19)   {
        this.drawClimbing(ctx);
    }
    
    else {
        
        this.drawDeadMario(ctx);
    }

    
}





Mario.prototype.drawWalking = function(ctx)  {
    var imageWidth;
    var imageHeight = this._height/8;
    var sourceX;
    var sourceY;
    
    // left 1
    if (this.version === 0) {
        imageWidth = this._width/8+4;
        sourceX = imageWidth*1;
        sourceY = 0;
    }
    // left 2
    else if (this.version === 1)  {
        imageWidth = this._width/8+2;
        sourceX = imageWidth*2;
        sourceY = 0;
    }  
    // left 3
    else if (this.version === 2)  {
        imageWidth = this._width/8;
        sourceX = imageWidth*3;
        sourceY = 0;
    } 
    // right 1
    else if (this.version === 3) {
        imageWidth = this._width/8;
        sourceX = imageWidth*4;
        sourceY = 0;
    }
    // right 2
    else if (this.version === 4)  {
        imageWidth = this._width/8-1;
        sourceX = imageWidth*5;
        sourceY = 0;
    }  
    // right 3
    else if (this.version === 5)  {
        imageWidth = this._width/8-1;
        sourceX = imageWidth*6;
        sourceY = 0;
    }

    
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, 
                                      this.cx-this._realWidth, this.cy-this._realHeight/2, 
                                      this._realWidth*2,this._realHeight);
}

Mario.prototype.drawWalkingHammer = function(ctx) {
    var imageWidth = this._width/6;
    var imageHeight = this._height/5
    var sourceX;
    var sourceY = imageHeight*2;

    var diffx = -31
    var dy = this.cy-this._realHeight;
    var w = 80;
    var h = this._realHeight*1.8;

    if (this.version === 6) {
        sourceX = imageWidth*0;

    } 
    else if (this.version === 7) {
        sourceX = imageWidth*1;
    

    } else if (this.version === 8) {
        sourceX = imageWidth*2;

    } else if (this.version === 9) {
        diffx = 5;
        sourceX = imageWidth*3;

    } else if (this.version === 10) {
        diffx = 5;

        sourceX = imageWidth*4;

    } else if (this.version === 11) {
        diffx = 4;

        sourceX = imageWidth*5;

    } 
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, 
        this.cx-this._realWidth+diffx, this.cy-this._realHeight-10, 
        w, h);
}

Mario.prototype.drawClimbing = function (ctx) {
    var imageWidth = this._width/8;
    var imageHeight = this._height/5;
    var sourceX;
    var sourceY = imageHeight*1;
    
    
    if (this.version === 12) {
        sourceX = imageWidth*0;
    }
    else if (this.version === 13) {
        sourceX = imageWidth*1;
    }
    else if (this.version === 14) {
        sourceX = imageWidth*2;
    }
    else if (this.version === 15) {
        sourceX = imageWidth*3;
    }
    else if (this.version === 16) {
        sourceX = imageWidth*4;
    }
    else if (this.version === 17) {
        sourceX = imageWidth*5;
    }
    else if (this.version === 18) {
        sourceX = imageWidth*6;
    }

    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, 
        this.cx-this._realWidth/1.2-3, this.cy-this._realHeight/3, 
        this._realWidth+20,this._realHeight);

}


Mario.prototype.drawDeadMario = function (ctx) {
    var imageWidth = this._width/8
    var imageHeight = this._height/6;
    var sourceX;
    var sourceY = imageHeight*5;
    
    // left 1
    if (this.version === 19) {
        sourceX = imageWidth*0;
    } 
    else if (this.version === 20) {
        sourceX = imageWidth*1;
    } 
    else if (this.version === 21) {
        sourceX = imageWidth*2;
    } 
    else if (this.version === 22) {
        sourceX = imageWidth*3;
    } 
    else if (this.version === 23) {
        sourceX = imageWidth*0-2
        sourceY = imageHeight*4
    }
    

    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, 
        this.cx-this._realWidth/2-4, this.cy-this._realHeight/2-10, 
        this._realWidth+12,this._realHeight+12);

}
Mario.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = -this._scale;
    this._draw(ctx);
   // this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation );
    this.sprite.scale = origScale;
};
