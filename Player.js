////////////////////////////////////////////////////////////////////////////////
// Player class
//
// create a player like this:
// var myPlayer = new Player( imageURI, frameIndexArray );
//
// where imageURI is a relative of absolute URL to the image having multiple frames next to each other
// and where frameIndexArray is the image's frame index to a certain jump style starting with index 1
// so, if you have an image with only two frames, it will look like this:
// [ 1, 1, 2, 2, 2, 2, 2 ] which stands for 'Stand','Brace', 'Jump', 'Tip', 'Fall', 'Land' and total number of frames respectively
// This gives each type of image an oppurtunity to animate in a similar manner
// Currently, the tipping point is 60% of the jump height, and the land frame is in effect after falling below 20%
// But the latter is subject to change
//
// Typically, to an animation tick and draw in each render frame:
// myPlayer.tick();
// myPlayer.draw( canvasDrawingContext );
//
// When you want to trigger a jump, you only have to do:
// myPlayer.jump();
////////////////////////////////////////////////////////////////////////////////
function Player( _image, _frames, _name, _factor )
{
    if ( _name )
        this.name = _name;

    this.imageWidth = 0;
    this.imageHeight = 0;
    this.image = new Image();
    this.image.src = _image;
    this.frames = _frames;
    this.frameCount = _frames[ JumpStyle.Count ];
    this.factor = _factor || 1;

    // Start standing
    this.currentJumpStyle = JumpStyle.Stand;
    this.timeStamp = 0;
    this.height = 0;

    // Set some variable stuff
    this.jumpHeight = 50 * this.factor;
    this.braceTime = 200;
    this.JumpTime = 1800;
};

Player.prototype.name = "Unnamed";

Player.prototype.jump = function()
{
    // Return if we're already in the jumping animation
    if ( this.currentJumpStyle !== JumpStyle.Stand )
        return;

    // Set jumping mode to trigger the animation in each tick
    this.jumping = true;
    this.timeStamp = new Date().getTime();
};

Player.prototype.tick = function()
{
    // No action if not jumping
    if ( !this.jumping )
        return;

    // Determine position on a certain time
    // by getting the sine and measuring the delta and distance from 0
    var timeDiff = new Date().getTime() - this.timeStamp;

    // Done after 2 seconds
    if ( timeDiff > this.braceTime + this.JumpTime )
    {
        if ( this.jumping )
        {
            this.height = 0;
            this.currentJumpStyle = JumpStyle.Stand;
            this.jumping = false;
        }

        return;
    }

    // First, player braces
    if ( timeDiff < this.braceTime )
    {
        this.currentJumpStyle = JumpStyle.Brace;
        return;
    }

    // Now comes the animation in 1800ms
    var newHeight = Math.sin( (timeDiff-this.braceTime) / this.JumpTime * Math.PI ) * this.jumpHeight;
    var heightDelta = newHeight - this.height;

    if ( heightDelta >= 0 )
    {
        // Jumping or tipping
        if ( newHeight > this.jumpHeight * 0.6 )
            this.currentJumpStyle = JumpStyle.Tip;
        else
            this.currentJumpStyle = JumpStyle.Jump;
    }
    else
    {
        // Falling, check land
        if ( newHeight < this.jumpHeight * 0.2 )
            this.currentJumpStyle = JumpStyle.Land;
        else
            this.currentJumpStyle = JumpStyle.Fall;
    }

    // Assign height
    this.height = newHeight;
};

Player.prototype.draw = function( _ctx )
{
    var frameWidth = this.image.width / this.frameCount;
    // Draw image in context
    var x = (this.frames[ this.currentJumpStyle ] - 1) * frameWidth;

    _ctx.drawImage( this.image, x, 0, frameWidth, this.image.height,
                   -(frameWidth/2) * this.factor, -(this.image.height * this.factor ) - this.height, (this.image.width/this.frameCount) * this.factor, this.image.height * this.factor );
};

Player.prototype.clone = function( _name )
{
    if ( !_name && this.name )
        _name = this.name;

    var player = new Player( this.image.src, this.frames, _name, this.factor );

    // We make a full clone, but this is not needed
    player.imageWidth       = this.imageWidth;
    player.imageHeight      = this.imageHeight;
    player.frameCount       = this.frameCount;

    player.currentJumpStyle = this.currentJumpStyle;
    player.timeStamp        = this.timeStamp;
    player.height           = this.height;
    player.jumpHeight       = this.jumpHeight;
    player.braceTime        = this.braceTime;
    player.JumpTime         = this.JumpTime;
    return player;
};

// end Player class
///////////////////

