////////////////////////////////////////////////////////////////////////////////
// NAME:        scene
// DESCRIPTION: Renders the scene
// DATE:        november 2011
// AUTHOR:      xopr
// LICENSE:     TBD. Currently the script's intellectual property copyright applies to xopr, 2011, but will change to (L)GPL/APL/MPL/BSD or the like
//              All images are property of their respectful owner.
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// class Scene
//
////////////////////////////////////////////////////////////////////////////////
function Scene( _attributes )
{
    this.horizon         = _attributes.horizon;
    this.ground          = _attributes.ground;
    this.angle           = _attributes.angle;
    this.airColor        = _attributes.airColor;
    this.horizonColor    = _attributes.horizonColor;
    this.oceanColor      = _attributes.oceanColor;
    this.groundColor     = _attributes.groundColor;
    this.waterInFront    = _attributes.waterInFront;
    this.relativeHeight  = _attributes.relativeHeight;
    this.relativeWidth   = _attributes.relativeWidth;
    this.canvasWidth     = _attributes.canvasWidth;
    this.canvasHeight    = _attributes.canvasHeight;
    this.cloudyness      = 25;
    this.maxPosition     = 20*1000; // 1000 'meter' a 20 pixels

    this.position        = 0;

    this.horizonItems    = this.loadImages( _attributes.horizonItems );
    this.cloudsBack      = this.loadCloudImages( _attributes.cloudsBack );
    this.cloudsFront     = this.loadCloudImages( _attributes.cloudsFront );
    this.distantItems    = this.loadImages( _attributes.distantItems );
    this.sceneryItems    = this.loadImages( _attributes.sceneryItems );
    this.backgroundItems = this.loadImages( _attributes.backgroundItems );
    this.foregroundItems = this.loadImages( _attributes.foregroundItems);
    this.frontItems      = this.loadImages( _attributes.frontItems );
}

Scene.prototype.finished = null;
Scene.prototype.finishedTime = null;
Scene.prototype.startTime = null;

Scene.prototype.loadImages = function( _arrImages )
{
    arrImages = new Array();
    
    for ( var idx = 0; idx < _arrImages.length; idx++ )
    {
        // Skip blanks
        if ( !_arrImages.hasOwnProperty( idx ))
            continue;
            
        var img = _arrImages[ idx ];
            
        var image = new Image( );
        image.loaded = false;
        image.onload = function( _event )
        {
            _event.target.loaded = true;
        }
        image.tile = img.tile;
        image._x = img.x;
        image._y = img.y;
        image.fixed = img.fixed;
        
        image._width = 0;
        image._height = 0;
        if ( img.hasOwnProperty( "width" ))
            image._width = img.width;
        if ( img.hasOwnProperty( "height" ))
            image._height = img.height;

        // Load the image
        image.src = img.img;

        arrImages.push( image );
    }

    return arrImages;
}

Scene.prototype.loadCloudImages = function( _arrImages )
{
    arrImages = new Array();
    arrClouds = new Array();

    for ( var idx = 0; idx < _arrImages.length; idx++ )
    {
        // Skip blanks
        if ( !_arrImages.hasOwnProperty( idx ))
            continue;

        var image = new Image( );
        
        image.loaded = false;
        image.onload = function( _event )
        {
            _event.target.loaded = true;
        }

        // Load the image
        image.src = _arrImages[ idx ];
        arrImages.push( image );
    }

    for ( var idx = 0; idx < this.cloudyness; idx++ )
    {
        var cloud = arrImages[ parseInt( Math.random() * arrImages.length ) ];
        cloud.tile = false;
        //cloud._x = Math.random() * ( this.canvasWidth );
        //cloud._x = Math.random() * ( this.canvasWidth + this.maxPosition );
        //cloud._x = Math.random() * ( 3 * this.canvasWidth );
        cloud._x = Math.random() * (3.2 * this.canvasWidth); // 0.15 0.11

        cloud._y = Math.random() * this.canvasHeight * this.horizon * 0.7;
        cloud._width = 0;
        cloud._height = 0;

        cloud.fixed = false;

        arrClouds.push( cloud );

    }
    return arrClouds;
}

Scene.prototype.draw = function( _context, _foreground )
{
    // Draw all stuff

    // Save original context
    _context.save();

    this.canvasWidth = document.getElementById('canvas').width;
    this.canvasHeight = document.getElementById('canvas').height;
    
    
    if ( !_foreground )
    {
      // Quick hack: clear the screen
      document.getElementById('canvas').width = document.getElementById('canvas').width;

      // Air
      _context.fillStyle = this.airColor;
      _context.fillRect( 0, 0, this.canvasWidth, this.canvasHeight * this.horizon );
  
  
      //if ( this.waterInFront )
  
      // Water
      _context.fillStyle = this.oceanColor;
      _context.fillRect( 0, this.canvasHeight * this.horizon, this.canvasWidth, this.canvasHeight * (this.ground - this.horizon) );
  
      // Ground
      _context.fillStyle = this.groundColor;
      _context.fillRect( 0, this.canvasHeight * this.ground, this.canvasWidth, this.canvasHeight * ( 1 - this.ground ));
  
      _context.restore();
  
  
      // Draw all images
      var idx;
      
      for (idx=0;idx < this.horizonItems.length;idx++ )
        this.drawImage( this.horizonItems[idx], _context, 0.1 )
  
      // Clouds are a special case since they are placed random and moving
      for (idx=0;idx < this.cloudsBack.length;idx++ )
          this.drawImage( this.cloudsBack[idx], _context, 0.11 )
      for (idx=0;idx < this.cloudsFront.length;idx++ )
          this.drawImage( this.cloudsFront[idx], _context, 0.15 )
        
      for (idx=0;idx < this.distantItems.length;idx++ )
          this.drawImage( this.distantItems[idx], _context, 0.2 )

      for (idx=0;idx < this.sceneryItems.length;idx++ )
        this.drawImage( this.sceneryItems[idx], _context, 0.6 )
        
      for (idx=0;idx < this.backgroundItems.length;idx++ )
        this.drawImage( this.backgroundItems[idx], _context, 0.9 )
    } else {
      for (idx=0;idx < this.foregroundItems.length;idx++ )
        this.drawImage( this.foregroundItems[idx], _context, 1.1 )
        
      for (idx=0;idx < this.frontItems.length;idx++ )
        this.drawImage( this.frontItems[idx], _context, 2.5 )

    }
}

Scene.prototype.setFinished = function( _finished )
{
    this.finished = _finished
    if ( !this.finishedTime )
        this.finishedTime = new Date();
};

Scene.prototype.drawImage = function( _image, _context, _perspective )
{
    // Draw the image
    if ( ! _image.loaded )
      return;

    _context.save();
    var width =  _image._width ? _image._width : _image.width;
    var height = _image._height ? _image._height : _image.height;

    var x = _image._x;
    var y = _image._y;
    
    // Percentage to absolute pixel
    if ( (x > -1) && (x < 1) )
        x = parseInt( x * this.canvasWidth);
    if ( y > -1 && y < 1 )
        y = parseInt( y * this.canvasHeight);

    // Pixel alignment trick
    /*if ( x < 0 )
        x = (-x) - width;*/
    if ( y < 0 )
        y = (-y) - height;



    if ( _image.tile )
    {
        var perspectiveAdjustment = 0;
        if ( !_image.fixed )
            perspectiveAdjustment = (this.position * _perspective);

        _context.fillStyle = _context.createPattern(_image, 'repeat');
        _context.translate(x - perspectiveAdjustment, y);
        
        // Scaling and its relative movement compensation
        _context.scale( _image._width ? _image._width / _image.width: 1, _image._height ? _image._height / _image.height : 1 );
        if ( _image._width )
            perspectiveAdjustment /= _image._width / _image.width;

        _context.fillRect(perspectiveAdjustment,0,(_image._x === false ? this.canvasWidth: _image.width),(_image._y === false ? this.canvasHeight: _image.height));
    } else {
        // Adjust x as we 'move'
        if ( !_image.fixed )
            x -= (this.position * _perspective)

        _context.drawImage( _image, x, y, width, height );
    }
    
    _context.restore();
}



Scene.prototype.setPosition = function( _nPosition )
{
    this.position = _nPosition;
}

// end Scene class
///////////////////

