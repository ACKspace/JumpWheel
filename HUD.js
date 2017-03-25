////////////////////////////////////////////////////////////////////////////////
// Heads-up display class
//
////////////////////////////////////////////////////////////////////////////////
function HUD()
{
    // Constructor, initialize variables
};

HUD.prototype.scene = null;
HUD.prototype.wheel = null;
HUD.prototype.players = null;
HUD.prototype.highscore = null;

HUD.prototype.tick = function()
{
    // game tick, calculate complex stuff, if needed    
};

HUD.prototype.draw = function( _context )
{
    // draw step, draw your fancy stuff here
    var text;

    // Set up font style
    _context.font = "bold 12px sans-serif";
    _context.textBaseline = "top";
    _context.textAlign = "right";

    // 20 pixels is about 1 meter
    text = Math.round( this.scene.position / 2 ) / 10 + " meter";
    text += "("+Math.round( this.scene.position ) + "/" + this.scene.maxPosition+")";

    _context.fillText( text, document.getElementById('canvas').width, 0);

};

HUD.prototype.setData = function( _scene, _wheel, _players, _highscore )
{
    // Set all class information so we can use it to draw our HUD
    this.scene = _scene;
    this.wheel = _wheel;
    this.players = _players;
    this.highscore = _highscore;
};

HUD.prototype.toString = function()
{
    // You could return a textual representation of this class, like speed, distance, etc
    return "Heads-up display.";
}

HUD.prototype.valueOf = function()
{
    // You could return a value for this class, like speed
    return 0;
}

// end HUD class
///////////////////

