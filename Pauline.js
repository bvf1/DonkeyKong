function Pauline(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.pauline;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1 * 5;

    this._width = this.sprite.width;
    this._height = this.sprite.height;
};



Pauline.prototype = new Entity();
Pauline.prototype.version = 0;


Pauline.prototype._draw = function(ctx) {
    var imageWidth = this._width/5;
    var imageHeight = this._height/1;
    var sourceX;
    var sourceY;
    // standing right with movement
    if (this.version == 0) {
        sourceX = imageWidth*3;
        sourceY = imageHeight*0;
    }
    // standing right
    else if (this.version == 1) {
        sourceX = imageWidth*4;
        sourceY = imageHeight*0;
    }
    // standing with movement
    else if (this.version == 2) {
        sourceX = imageWidth*3;
        sourceY = imageHeight*0;
    }
    // heart - I'm not using this right now. Will add it later when Mario can reach her.
    /*else if (this.version == 3) {
        sourceX = imageWidth*2;
        sourceY = imageHeight*0;
    }*/
    
    // I wasn't sure how big or wide to make her but currently I like it this way.
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, this.cx, this.cy, 50, 30);
}
// Sprite.prototype.drawPartialImage = function (ctx, sx, sy, cx, cy, dWidth, dHeight) {
    

Pauline.prototype.time = 0;
Pauline.prototype.update = function (du) {
    this.time += du;
    // I wanted her to move a bit like she's scared and frantic. Might change later.
    if (this.time > 35) {
        this.time = 0;
        this.version += 1;
        
        if (this.version === 2){
            this.time = 2;
            this.version = 0;
        }
    }

} 



Pauline.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this._draw(ctx);
    this.sprite.scale = origScale;
};
