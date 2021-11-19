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
Kong.prototype.allowGenerate = true;
Kong.prototype.allowSpecialBarrel = true;


Kong.prototype._draw = function(ctx) {
    var imageWidth = this._width/6;
    var imageHeight = this._height/3;
    var sourceX;
    var sourceY;
    // straight on no barrel
    
    if (this.version == 0 || !entityManager._mario.getAliveStatus()) {
        

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
        if (this.allowSpecialBarrel) {
        //    entityManager.generateBarrel({cx : this.cx+53, cy : this.cy+this._height/2+10,specialBarrel : true});
            this.allowSpecialBarrel = false;
            this.version = 0;
        }
        var allow = util.randRange(0,20);
        if (allow <= 1) this.allowSpecialBarrel = false;
        sourceX = imageWidth*2;
        sourceY = -4;
    }
    // barrel right
    else if (this.version == 3) {

        sourceX = (imageWidth*4)+2;
        sourceY = imageHeight*1;
        var cx = this.cx + imageWidth*2;
      //  if (this.allowGenerate === true) entityManager.generateBarrel({cx : cx, cy : 98});

    }
    this.sprite.drawPartialImage(ctx, sourceX, sourceY, imageWidth, imageHeight, this.cx, this.cy, 100,100);
}
    

Kong.prototype.time = 0;
Kong.prototype.update = function (du) {
    this.cycleVersions(du, 0.5, 0, 3);
    if (this.version === 0) this.allowGenerate = true;
    

} 



Kong.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this._draw(ctx);
    if (this.version == 3) this.allowGenerate = false;

    this.sprite.scale = origScale;
};
