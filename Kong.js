function Kong(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.enemies;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this._width = this.sprite.width;
    this._height = this.sprite.height;
};



Kong.prototype = new Entity();
Kong.prototype.version = 0;


Kong.prototype._draw = function(ctx) {
    var imageWidth = this._width/6;
    var imageHeight = this._height/3;
    var sourceX;
    var sourceY;
    // straight on no barrel
    if (this.version == 0) {
        sourceX = imageWidth*2;
        sourceY = imageHeight*1;
    }
    // barrel left
    else if (this.version == 1) {
        sourceX = imageWidth*0;
        sourceY = imageHeight*1;
    }
    // straight on barrel
    else if (this.version == 2) {
        sourceX = imageWidth*2;
        sourceY = -4;
    }
    // barrel right
    else if (this.version == 3) {
        sourceX = (imageWidth*4)+2;
        sourceY = imageHeight*1;
        // send barrel;
    }
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, this.cx, this.cy, 100,100);
}
// Sprite.prototype.drawPartialImage = function (ctx, sx, sy, cx, cy, dWidth, dHeight) {
    

Kong.prototype.time = 0;
Kong.prototype.update = function (du) {
    this.time += du;
    if (this.time > 90) {
        this.time = 0;
        this.version += 1;

        if (this.version == 4){
            
            this.version = 0;
        }
        console.log("this version " + this.version);
    }

} 



Kong.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this._draw(ctx);
    this.sprite.scale = origScale;
};
