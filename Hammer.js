function Hammer(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.enemies;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this._width = this.sprite.width/6+3;
    this._height = this.sprite.height/6; //3*2)/2;

    spatialManager.register(this);   
};


Hammer.prototype = new Entity();
Hammer.prototype.tag = "Hammer";
Hammer.prototype.radius = 5;
Hammer.prototype.isHanging = true;
Hammer.prototype.isAlive = true;
Hammer.prototype.time =0;


Hammer.prototype.getRadius = function () {
    return this.radius;
}


Hammer.prototype.inUse = function() {
    
    this.isHanging = false;
    this.radius = 8;
   // this.kill();
}

Hammer.prototype.updateFromMario = function() {
    var marioPos = entityManager._mario.getPos();
    var vs = entityManager._mario.getVersion();

    if (vs === 6) {
        this.cx = marioPos.posX-46;
        this.cy = marioPos.posY;
    }
    else if (vs === 7) {
        this.cx = marioPos.posX;
        this.cy = marioPos.posY-31;
    }
    else if (vs === 8) {
        this.cx = marioPos.posX-39;
        this.cy = marioPos.posY;
    }
    else if (vs === 9) {
        this.cx = marioPos.posX+36;
        this.cy = marioPos.posY;
    }
    else if (vs === 10) {
        this.cx = marioPos.posX;
        this.cy = marioPos.posY-31;
    }
    else if (vs === 11) {
        this.cx = marioPos.posX+36;
        this.cy = marioPos.posY;
    }
    
}

Hammer.prototype.update = function(du) {
    spatialManager.unregister(this);  

    // for programming
    if (!this.isHanging) {
        this.time += du;
        if (this.time > 10*SECS_TO_NOMINALS) {

            
            this.time =0;
            console.log("kill hammer")
            this.kill();
            entityManager._mario.hasHammer = false;
        }
        this.updateFromMario();
    }

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    spatialManager.register(this);   

}


Hammer.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    if (this.isHanging) {
        this.sprite.drawPartialImage(
        ctx, this._width*5, this._height*2, 
        this._width, this._height,
        this.cx-35, this.cy-this._height-12, 
        120, 40
        );

    }

    this.sprite.scale = origScale;
};

