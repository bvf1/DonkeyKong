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
Mario.prototype.KEY_UP = 'W'.charCodeAt(0);
Mario.prototype.KEY_DOWN = 'S'.charCodeAt(0);
Mario.prototype.KEY_JUMP = ' '.charCodeAt(0);

Mario.prototype.velX = 0;
Mario.prototype.velY = 0;
Mario.prototype.grounded = false;
Mario.prototype.jumping = false;
Mario.prototype.allowClimb = false;
Mario.prototype.climbing = false;
Mario.prototype.tag = "Mario";

Mario.prototype.floor = 0;

var NOMINAL_GRAVITY = 0.12;

Mario.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
}

var NOMINAL_SPEED = 0.2;


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

var JUMP_HEIGHT = 8;

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

Mario.prototype.reset = function () {
    // Remember my reset positions
    this.setPos(this.reset_cx, this.reset_cy);
};

Mario.prototype.dies = function () {
    entityManager.killBarrels();
    this.reset();
}


Mario.prototype.update = function (du) {
    spatialManager.unregister(this);

    var accelX = this.computeWalk();
    var accelY = 0;

    accelY += this.computeJump();
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
        if (collision[3]) {
            if (collision[3].tag === "Barrel") {
                this.dies();
                if (this._isDeadNow) return entityManager.KILL_ME_NOW;
            }
        }
        spatialManager.register(this);
    } else {
        this.grounded = false;
        this.allowClimb = false;
        this.climbing = false;
        spatialManager.register(this);
    }

}

var MAX_SPEED = 2.5;

Mario.prototype.applyAccel = function (accelX, accelY, du) {
    var oldVelX = this.velX;
    var oldVelY = this.velY;

    this.velX += accelX * du;
    this.velY += accelY * du;
    
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
    this.cx += du * aveVelX;
    this.cy += du * aveVelY;
}

Mario.prototype.getRadius = function () {
    return this._height/2;
}

Mario.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};