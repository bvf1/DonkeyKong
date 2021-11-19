
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
    entityManager.makeOil();

    entityManager.makeWalkway();
    entityManager.makeLadders();

    // Might change in the near future due to more saucy barrels 
    // being added in the near future
    entityManager.makeBarrels();
  //  entityManager.generateBarrel({cx : 30, cy : 30});
    entityManager.makeHammers();

    
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
var g_stopscreen = false;
var timer1 = new util.Timer(0.5*SECS_TO_NOMINALS);
var timer2 = new util.Timer(2*SECS_TO_NOMINALS);
var text = "";
var gameOver = false;

function updateSimulation(du) {
    
    processDiagnostics();


    var text = entityManager._mario.lives + " Lifes left";



    if (g_stopscreen == false)
    entityManager.update(du);
    else {
        var status = entityManager._mario.status;
        switch (status) {
            // timer to freze screen right after dying
            case "dying":
                if (timer1.tick(du)) {
                    entityManager._mario.waiting();
                    g_stopscreen = false;
                    timer2 = new util.Timer(2*SECS_TO_NOMINALS);
                }
                break;
            // timer for showing dead mario
            case "waiting":
                if (timer2.tick(du)) {
                    entityManager._mario.newLife();
                    g_stopscreen = false;
                    timer1 = new util.Timer(0.5*SECS_TO_NOMINALS);
                    
                }
                break;
          //  case:


        }
       /* if (timer.tick(du)) {
            entityManager._mario.newLife();
            g_stopscreen = false;
        }*/

    }

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

    if (gameOver === "true") return;
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);





    var oldStyle = ctx.fillStyle;
    ctx.font = "18px Verdana";
    ctx.fillText(entityManager._mario.lives + " Lifes Left", 400, 20);
    ctx.fillText("Score :    " + entityManager._mario.score, 400, 40);


    ctx.fillStyle = oldStyle;






    if (entityManager._mario.lives === 0) {
        ctx.font = "50px Georgia";
        entityManager._mario.lives = 3;
        entityManager._mario.score = 0;
        gameOver = true;

        util.clearCanvas(ctx);
        ctx.fillText("Game Over !", 120, 230);
    }



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
        mario   : "images/mario2.png",
        enemies : "images/enemies.png",
        pauline : "images/pauline.png",
        oils    : "images/oils.png"
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
   // g_sprites.oil = new Sprite(g_images.oil);
    g_sprites.enemies = new Sprite(g_images.enemies);
    g_sprites.pauline = new Sprite(g_images.pauline);
    g_sprites.oil = new Sprite(g_images.oils);

    entityManager.init();
    createInitialObjects();

    main.init();
}

// Kick it off
requestPreloads();