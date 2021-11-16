// ==========
// Ladder STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ladder(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ladder;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;

    this._width = this.sprite.width;
    this._spriteHeight = this.sprite.height;

    spatialManager.register(this);   

};

Ladder.prototype = new Entity();

Ladder.prototype.tag = "Ladder";

// Initial, inheritable, default values
    
Ladder.prototype.update = function (du) {

    
};


Ladder.prototype.getSize = function() {
    return { 
        width : this._width, 
        height : this.height
    }

};

Ladder.prototype.getRadius = function () {
    return this._width/2;
}

Ladder.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    let rungs = Math.floor(this.height/this._spriteHeight);
    for (let i = 0; i < rungs; i++) {
        if (!this.broken || (i !== Math.floor(rungs/2) && i !== Math.floor(rungs/2)-1)) {
            this.sprite.drawCentredAt(
                ctx,
                this.cx+this.sprite.width/2, 
                this.cy-this._spriteHeight/2-this._spriteHeight*i, 
                this.rotation
            );
        }
    }
    this.sprite.scale = origScale;
};

