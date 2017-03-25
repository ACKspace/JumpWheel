////////////////////////////////////////////////////////////////////////////////
// Wheel class
//
////////////////////////////////////////////////////////////////////////////////
function Wheel( _image, _x, _y, _radius, _factor )
{
    this.image = new Image();
    this.image.src = _image;
    this.x = _x;
    this.y = _y;
    this.radius = _radius;
    this.factor = _factor || 1;

    this.platformDistance = 0.9;
    this.platformWidth = 30 * this.factor;
    this.platformHeight = 4;
    
    this.rotation = 0;
    this.speed = 0.00;
    
    this.resistance = 0.98;
    this.weightDistribution = 0;
    
    // TODO: move to player
    this.playerWeight = 0.001;

}

Wheel.prototype.tick = function()
{
  
    this.weightDistribution = 0;

    // Do the player frame and get their position
    for ( var idx = 0; idx < players.length; idx++)
    {
        players[idx].tick();

        var playerRotation = idx / players.length * 2 * Math.PI + Math.PI / 4;

        
        this.weightDistribution -= (players[idx].jumping?1:0) * Math.cos( this.rotation + playerRotation );
        
        /*
        if ( players[idx].jumping )
          console.log( Math.cos( this.rotation + playerRotation ) )
        */
    }

    this.weightDistribution *= this.playerWeight;

    //console.log( this.weightDistribution );
    //console.log( _event );

    //this.weightDistribution = 0;

    /*
    Cylinder_MassaVerdeling    = 
        Speler_Massa * (
        Speler1_x * cos(Cylinder_Rotatie + ? * PI) +
        Speler2_x * cos(Cylinder_Rotatie + ? * PI)
        
        );
    Cylinder_Snelheid    = Cylinder_Snelheid * Cylinder_Weerstand + Cylinder_MassaVerdeling;
    
    
    Cylinder_Rotatie    = Cylinder_Rotatie + Cylinder_Snelheid;    
    */

    
    //this.speed *= this.resistance + this.weightDistribution;
    this.speed = this.speed * this.resistance + this.weightDistribution;

    // Wheel rotation cheat
    if ( this.cheat )
        this.speed += this.cheat;

    this.rotation += this.speed;

};

Wheel.prototype.draw = function( _context )
{
    // Save original context
    _context.save();

    var cw = document.getElementById('canvas').width;
    var ch = document.getElementById('canvas').height;
    
    var x = this.x;
    var y = this.y;
    
    
    if ( x < 1 )
        x *= cw;
    if ( y < 1 )
        y *= ch;

    _context.translate( x, y - ( this.radius / 2 ) );

    // Save axis for drawing wheel and arms
    _context.save();
    
    _context.rotate( this.rotation );
    _context.drawImage( this.image, -this.radius/2, -this.radius/2, this.radius, this.radius);

    _context.strokeStyle = "#000";
    _context.lineWidth = this.platformHeight;

    
    for ( var idx = 0; idx < players.length; idx++)
    {
        var playerRotation = idx / players.length * 2 * Math.PI + Math.PI / 4;
        
        //playerRotation = 0;
        // Save arm
        _context.save();
        _context.rotate( playerRotation );
        
        // 2x width
        //_context.translate( this.radius*this.platformDistance/2, this.radius*this.platformDistance/2 );
        _context.translate( this.radius*this.platformDistance/2, 0 );
        _context.rotate( - playerRotation - this.rotation);

        // Player tick and draw on each frame
        players[idx].tick( );
        players[idx].draw( _context );
        
        _context.beginPath();
        _context.moveTo(-this.platformWidth/2,0);
        _context.lineTo(this.platformWidth/2,0);
        _context.stroke();
        _context.restore();
        
    }


    /*
    var nCurPlayer = 0;
    
    var nArms = players.length;
    for ( var n=0; n < 2*Math.PI; n+=Math.PI*2/nArms )
    {
        // Save arm
        _context.save();
        _context.rotate( n );

        // 2x width
        _context.translate( this.radius*this.platformDistance/2, this.radius*this.platformDistance/2 );
        _context.rotate( - n - this.rotation);

        // Player tick and draw on each frame
        players[nCurPlayer].tick( );
        players[nCurPlayer].draw( _context );
        
        nCurPlayer = (nCurPlayer+1)%players.length;

        _context.beginPath();
        _context.moveTo(-this.platformWidth/2,0);
        _context.lineTo(this.platformWidth/2,0);
        _context.stroke();
        _context.restore();
    }
    */

    _context.restore();
    _context.restore();
}

Wheel.prototype.getPosition = function( )
{
    //
    //return Math.PI * this.rotation * this.radius / 2;
    // circle perimeter 2PI*r = PI*d
    // 1 rotation = 2*PI
    // part of circle means: PI*d*rotation/(2*PI) = d*rotation/2

    return this.rotation * this.radius / 2;
}

// end Wheel class
///////////////////

