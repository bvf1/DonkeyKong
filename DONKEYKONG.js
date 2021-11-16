
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ======================
// CREATE INITIAL OBJECTS
// ======================

function createInitialObjects() {

    /*entityManager.generateBrick({
        cx : 200,
        cy : 100
    });*/
    entityManager.itsaPauline();
    entityManager.itsaDonkey();
    entityManager.itsaMe();
    entityManager.makeWalkway();
    entityManager.makeLadders();

    // Might change in the near future due to more saucy barrels 
    // being added in the near future
    entityManager.makeBarrels();
    entityManager.makeOil();
    entityManager.generateHammer({cx : 40, cy : 140});
    entityManager.generateHammer({cx : 400, cy : 400});

    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var KEY_SPATIAL = keyCode('X');


function processDiagnostics() {


    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

}

// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        brick   : "images/1brick2.png",
        ladder  : "images/ladder.png",
        barrels4: "images/barrels4.png",
        barrel  : "images/barrel.png",
        oil     : "images/oil.png",
        mario   : "images/mario.png",
        enemies : "images/enemies.png",
        pauline : "images/pauline.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.mario = new Sprite(g_images.mario);
    g_sprites.brick = new Sprite(g_images.brick);
    g_sprites.ladder = new Sprite(g_images.ladder);
    g_sprites.barrels4 = new Sprite(g_images.barrels4);
    g_sprites.barrel = new Sprite(g_images.barrel);
    g_sprites.oil = new Sprite(g_images.oil);
    g_sprites.enemies = new Sprite(g_images.enemies);
    g_sprites.pauline = new Sprite(g_images.pauline);

    entityManager.init();
    createInitialObjects();

    main.init();
}

// Kick it off
requestPreloads();