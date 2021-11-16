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
Hammer.prototype.radius = 8;

Hammer.prototype.getRadius = function () {
    return this.radius;
}

Hammer.prototype.update = function (du) {

    spatialManager.unregister(this);
    spatialManager.register(this);


}



Hammer.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawPartialImage(
	ctx, this._width*5, this._height*2, 
    this._width, this._height,
    this.cx-this._width/2+13, this.cy-this._height-9, 
    70, 50
    );
    ctx.fillRect(this.cx, this.cy, this.radius*2, this.radius*2)

    this.sprite.scale = origScale;
};