function Mario(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.mario;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this._width = this.sprite.width;
    this._height = this.sprite.height;

    spatialManager.register(this);   
};


Mario.prototype = new Entity();

Mario.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Mario.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Mario.prototype.velX = 0;
Mario.prototype.velY = 0;
Mario.prototype.grounded = false;
Mario.prototype.tag = "Mario";

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

Mario.prototype.update = function (du) {

    spatialManager.unregister(this);

    var accelX = this.computeWalk();
    var accelY = 0;
    
    accelY += this.computeGravity();

    this.applyAccel(accelX, accelY, du);

    var collision = this.isColliding();

    if (collision) {
        if (collision.tag === "Brick") {
            this.grounded = true;
            //Step onto the platforms, might need to change in order to make ladders work well
            if (this.cy + this.getRadius() > collision.getPos().posY - collision.getSize().height/2) {
                this.cy = collision.getPos().posY - collision.getSize().height/2 - this.getRadius();
            }
        }
    } else {
        this.grounded = false;
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
    //Applying max speed
    if (Math.abs(aveVelX) > MAX_SPEED) {
        aveVelX = aveVelX/Math.abs(aveVelX) * MAX_SPEED;
    }

    var nextX = this.cx + aveVelX * du;

    //Apply gravity somehow

    if (this.grounded) {
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