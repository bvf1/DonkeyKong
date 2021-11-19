/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    return this._nextSpatialID++;

},

register: function(entity) {

    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    
    this._entities.splice(spatialID,0,{
        posX: pos.posX,
        posY: pos.posY,
        radius: entity.getRadius(),
        entity: entity
    });
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].entity.getSpatialID() === spatialID) {
            this._entities.splice(i,1);
            return;
        }
    }
},

findEntityInRange: function(posX, posY, radius) {
    var entitiesInRange = [];
    for (var ID in this._entities) {
        var e = this._entities[ID];
        if (e.entity.tag === "Brick") {
            var size = e.entity.getSize();
            var pos = e.entity.getPos();
            if (posY + radius >= pos.posY - size.height/2 &&
                posX > pos.posX - size.width/2 &&
                posX < pos.posX + size.width/2 &&
                posY + radius < pos.posY) {
                entitiesInRange[0] = e.entity;
            }
        }
        if (e.entity.tag === "Ladder") {
            var size = e.entity.getSize();
            var pos = e.entity.getPos();
            if (posX > pos.posX &&
                posX < pos.posX + size.width &&
                posY > pos.posY - size.height &&
                posY < pos.posY) {
                entitiesInRange[1] = e.entity;
            }
        }
        if (e.entity.tag === "Oil") {
            var size = e.entity.getSize();
            var pos = e.entity.getPos();
            if (pos.posX > posX-radius && pos.posX < posX+radius &&
                pos.posY > posY-radius && pos.posY < posY+radius){
                entitiesInRange[2] = e.entity;
            }
        }
        if (e.entity.tag === "Barrel") {
            var size = e.entity.getSize();
            var pos = e.entity.getPos();
            var entRadius = e.entity.getRadius();
            if (size === null) {
                if (util.dist(posX, pos.posX) < radius + entRadius &&
                    util.dist(posY, pos.posY) < radius + entRadius)
                    entitiesInRange[3] = e.entity;
                
            }
            else if (posX > pos.posX &&
                posX < pos.posX + size.width &&
                posY > pos.posY - size.height &&
                posY < pos.posY) {
                entitiesInRange[3] = e.entity;
            }
        }
        if (e.entity.tag === "Hammer") {
            var pos = e.entity.getPos();
            if (pos.posX > posX-radius && pos.posX < posX+radius &&
                pos.posY > posY-radius && pos.posY < posY+radius){
                entitiesInRange[4] = e.entity;
            }
        }

        /*if (util.wrappedDistSq(e.posX, e.posY, posX, posY, 
                               g_canvas.width, g_canvas.height)
             < util.square(e.radius+radius)) {
            return e.entity;
        }*/
    }
    if (entitiesInRange.length > 0) {
        return entitiesInRange;
    }
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        if (e.entity.tag === "Ladder") {
            var size = e.entity.getSize();
            util.strokeBox(ctx, e.posX, e.posY-size.height, size.width, size.height, "red");
        }
        else if (e.entity.tag === "Barrel") {
            var size = e.entity.getSize();
            var entRadius = e.entity.getRadius();
            if (size === null) util.strokeCircle(ctx, e.posX, e.posY, entRadius);
            else util.strokeBox(ctx, e.posX-size.width/2, e.posY-size.height/2, size.width, size.height, "red");
        }
        else {
            util.strokeCircle(ctx, e.posX, e.posY, e.radius);
        }
    }
    ctx.strokeStyle = oldStyle;
}

}
